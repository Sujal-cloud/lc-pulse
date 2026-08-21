require("dotenv").config();

const prisma = require("../src/db/prisma");

const LeetCodeClient =
    require("../src/services/leetcode/leetcodeClient");

const {
    runIncrementalSync
} = require("../src/services/sync/incrementalSync");


async function main() {

    try {

        console.log(
            "🚀 LC Pulse incremental sync test"
        );

        // ----------------------------------------
        // FIND USER
        // ----------------------------------------

        const user =
            await prisma.user.findUnique({

                where: {
                    leetcodeUsername:
                        "sujal_codes"
                }
            });

        if (!user) {
            throw new Error(
                "sujal_codes user not found."
            );
        }

        // ----------------------------------------
        // LEETCODE CLIENT
        // ----------------------------------------

        const leetcodeClient =
            new LeetCodeClient(
                process.env.LEETCODE_SESSION
            );

        await leetcodeClient.initialize();

        console.log(
            "✅ LeetCode client initialized.\n"
        );

        // ----------------------------------------
        // RUN INCREMENTAL SYNC
        // ----------------------------------------

        const result =
            await runIncrementalSync(
                user,
                leetcodeClient
            );

        console.log("\nRESULT");
        console.log("====================");

        console.log(
            `New submissions: ${result.newSubmissions}`
        );

        console.log(
            `New problems:    ${result.newProblems}`
        );

    } catch (error) {

        console.error(
            "\n❌ Incremental sync failed:"
        );

        console.error(error);

    } finally {

        await prisma.$disconnect();
    }
}

main();