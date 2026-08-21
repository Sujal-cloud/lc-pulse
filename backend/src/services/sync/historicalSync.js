const prisma = require("../../db/prisma");

const PAGE_SIZE = 20;

async function runHistoricalSync(
    user,
    leetcodeClient,
    maxSubmissions = Infinity
) {

    const syncRun = await prisma.syncRun.create({
        data: {
            userId: user.id,
            status: "RUNNING"
        }
    });

    let offset = 0;

    let submissionsRead = 0;
    let problemsFound = new Set();

    try {

        while (true) {
            if (submissionsRead >= maxSubmissions) {
                break;
            }
            console.log(
                `📥 Syncing submissions at offset ${offset}...`
            );

            const submissions =
                await leetcodeClient.getSubmissions(
                    PAGE_SIZE,
                    offset
                );

                const remaining =
                    maxSubmissions - submissionsRead;

                const batch =
                    submissions.slice(0, remaining);

            if (submissions.length === 0) {
                break;
            }

            for (const submission of batch) {

                submissionsRead++;

                const slug = submission.titleSlug;

                // ----------------------------------------
                // 1. FIND OR CREATE PROBLEM
                // ----------------------------------------

                const problem =
                    await prisma.problem.upsert({

                        where: {
                            slug: slug
                        },

                        update: {},

                        create: {
                            title: submission.title,
                            slug: slug
                        }
                    });

                problemsFound.add(problem.id);

                // ----------------------------------------
                // 2. STORE SUBMISSION
                // ----------------------------------------

                const submissionTimestamp =
                    new Date(
                        Number(submission.timestamp)
                    );

                await prisma.submission.upsert({

                    where: {
                        leetcodeId:
                            String(submission.id)
                    },

                    update: {},

                    create: {

                        leetcodeId:
                            String(submission.id),

                        title: submission.title,

                        slug: slug,

                        status:
                            submission.statusDisplay,

                        language:
                            submission.lang || null,

                        timestamp:
                            submissionTimestamp,

                        userId:
                            user.id,

                        problemId:
                            problem.id
                    }
                });

                // ----------------------------------------
                // 3. HANDLE FIRST SOLVE
                // ----------------------------------------

                if (
                    submission.statusDisplay ===
                    "Accepted"
                ) {

                    const existingUserProblem =
                        await prisma.userProblem.findUnique({

                            where: {
                                userId_problemId: {
                                    userId: user.id,
                                    problemId: problem.id
                                }
                            }
                        });

                    // First time this user solved
                    // this problem
                    if (!existingUserProblem) {

                        await prisma.userProblem.create({

                            data: {

                                userId:
                                    user.id,

                                problemId:
                                    problem.id,

                                firstSolvedAt:
                                    submissionTimestamp
                            }
                        });

                    } else {

                        // Make sure the earliest
                        // Accepted submission wins.

                        if (
                            submissionTimestamp <
                            existingUserProblem.firstSolvedAt
                        ) {

                            await prisma.userProblem.update({

                                where: {
                                    id:
                                        existingUserProblem.id
                                },

                                data: {
                                    firstSolvedAt:
                                        submissionTimestamp
                                }
                            });
                        }
                    }
                }
            }

            console.log(
                `   Processed ${submissionsRead} submissions`
            );

            if (
                submissions.length < PAGE_SIZE ||
                submissionsRead >= maxSubmissions
            ) {
                break;
            }

            offset += PAGE_SIZE;
        }

        // ----------------------------------------
        // COMPLETE SYNC
        // ----------------------------------------

        await prisma.syncRun.update({

            where: {
                id: syncRun.id
            },

            data: {

                status: "COMPLETED",

                completedAt:
                    new Date(),

                submissionsRead,

                problemsFound: problemsFound.size
            }
        });

        console.log("\n✅ Historical sync completed.");

        console.log(
            `Submissions processed: ${submissionsRead}`
        );

        console.log(
            `Problems encountered: ${problemsFound.size}`
        );

    } catch (error) {

        await prisma.syncRun.update({

            where: {
                id: syncRun.id
            },

            data: {

                status: "FAILED",

                completedAt:
                    new Date(),

                submissionsRead,

                problemsFound: problemsFound.size,

                errorMessage:
                    error.message
            }
        });

        throw error;
    }
}

module.exports = {
    runHistoricalSync
};