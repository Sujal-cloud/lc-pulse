const prisma = require("../src/db/prisma");

async function main() {
    try {
        console.log("\n🔍 LC PULSE DATA INTEGRITY CHECK");
        console.log("================================\n");

        // ----------------------------------------
        // BASIC COUNTS
        // ----------------------------------------

        const submissions =
            await prisma.submission.count();

        const problems =
            await prisma.problem.count();

        const userProblems =
            await prisma.userProblem.count();

        console.log("DATABASE");
        console.log(`Submissions:  ${submissions}`);
        console.log(`Problems:     ${problems}`);
        console.log(`UserProblems: ${userProblems}`);

        // ----------------------------------------
        // ACCEPTED UNIQUE PROBLEMS
        // ----------------------------------------

        const acceptedSubmissions =
            await prisma.submission.findMany({

                where: {
                    status: "Accepted"
                },

                select: {
                    problemId: true
                },

                distinct: ["problemId"]
            });

        const acceptedUniqueProblems =
            acceptedSubmissions.length;

        console.log("\nACCEPTED PROBLEMS");
        console.log(
            `Unique Accepted problems: ${acceptedUniqueProblems}`
        );

        // ----------------------------------------
        // FIRST SOLVE RECORDS
        // ----------------------------------------

        const firstSolves =
            await prisma.userProblem.count();

        console.log("\nFIRST SOLVES");
        console.log(
            `First-solve records: ${firstSolves}`
        );

        // ----------------------------------------
        // EARLIEST SOLVE
        // ----------------------------------------

        const earliest =
            await prisma.userProblem.findFirst({

                orderBy: {
                    firstSolvedAt: "asc"
                },

                include: {
                    problem: true
                }
            });

        if (earliest) {

            console.log("\nEARLIEST SOLVE");
            console.log(
                `Problem: ${earliest.problem.title}`
            );

            console.log(
                `Date: ${earliest.firstSolvedAt.toISOString()}`
            );
        }

        // ----------------------------------------
        // LATEST SOLVE
        // ----------------------------------------

        const latest =
            await prisma.userProblem.findFirst({

                orderBy: {
                    firstSolvedAt: "desc"
                },

                include: {
                    problem: true
                }
            });

        if (latest) {

            console.log("\nLATEST SOLVE");
            console.log(
                `Problem: ${latest.problem.title}`
            );

            console.log(
                `Date: ${latest.firstSolvedAt.toISOString()}`
            );
        }

        // ----------------------------------------
        // CONSISTENCY CHECK
        // ----------------------------------------

        console.log("\nCONSISTENCY");
        console.log("================================");

        if (
            acceptedUniqueProblems ===
            firstSolves
        ) {
            console.log(
                "✅ Accepted problems = first-solve records"
            );
        } else {
            console.log(
                "⚠️ Accepted problems != first-solve records"
            );
        }

        console.log("\n✅ Integrity check completed.");

    } catch (error) {

        console.error(
            "\n❌ Integrity check failed:"
        );

        console.error(error);

    } finally {

        await prisma.$disconnect();
    }
}

main();