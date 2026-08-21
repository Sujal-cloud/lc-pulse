const prisma = require("../../db/prisma");

const PAGE_SIZE = 20;

async function runIncrementalSync(user, leetcodeClient) {

    console.log("\n🔄 Starting incremental sync...\n");

    let offset = 0;
    let newSubmissions = 0;
    const newProblems = new Set();

    // Find the newest submission currently stored
    const latestStoredSubmission =
        await prisma.submission.findFirst({
            where: {
                userId: user.id
            },
            orderBy: {
                timestamp: "desc"
            }
        });

    if (latestStoredSubmission) {
        console.log(
            `📌 Latest stored submission: ${latestStoredSubmission.title}`
        );

        console.log(
            `📅 Stored at: ${latestStoredSubmission.timestamp.toISOString()}\n`
        );
    }

    while (true) {

        console.log(
            `📥 Checking submissions at offset ${offset}...`
        );

        const submissions =
            await leetcodeClient.getSubmissions(
                PAGE_SIZE,
                offset
            );

        if (submissions.length === 0) {
            break;
        }

        let reachedExistingSubmission = false;

        for (const submission of submissions) {

            // Check whether this exact submission
            // already exists in our database.
            const existingSubmission =
                await prisma.submission.findUnique({
                    where: {
                        leetcodeId:
                            String(submission.id)
                    }
                });

            if (existingSubmission) {
                reachedExistingSubmission = true;
                continue;
            }

            // ----------------------------------------
            // NEW SUBMISSION
            // ----------------------------------------

            newSubmissions++;

            const slug = submission.titleSlug;

            // ----------------------------------------
            // FIND / CREATE PROBLEM
            // ----------------------------------------

            const problem =
                await prisma.problem.upsert({

                    where: {
                        slug
                    },

                    update: {},

                    create: {
                        title: submission.title,
                        slug
                    }
                });

            // ----------------------------------------
            // STORE SUBMISSION
            // ----------------------------------------

            const submissionTimestamp =
                new Date(
                    Number(submission.timestamp)
                );

            await prisma.submission.create({

                data: {

                    leetcodeId:
                        String(submission.id),

                    title:
                        submission.title,

                    slug,

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
            // FIRST SOLVE
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

                    newProblems.add(problem.id);

                    console.log(
                        `   🆕 New problem: ${submission.title}`
                    );

                } else {

                    // If the problem already exists,
                    // make sure the earliest Accepted
                    // submission remains the first solve.

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
            `   New submissions found: ${newSubmissions}`
        );

        // Once we encounter submissions already
        // stored in our database, we have reached
        // the previously synchronized history.
        if (reachedExistingSubmission) {
            break;
        }

        offset += PAGE_SIZE;
    }

    console.log("\n================================");
    console.log("INCREMENTAL SYNC COMPLETE");
    console.log("================================");

    console.log(
        `New submissions: ${newSubmissions}`
    );

    console.log(
        `New problems solved: ${newProblems.size}`
    );

    return {
        newSubmissions,
        newProblems: newProblems.size
    };
}

module.exports = {
    runIncrementalSync
};