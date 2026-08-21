require("dotenv").config();

const prisma = require("../src/db/prisma");

const LeetCodeClient =
    require("../src/services/leetcode/leetcodeClient");

const {
    runHistoricalSync
} = require("../src/services/sync/historicalSync");


async function main() {

    try {

        console.log("🚀 Starting historical sync test...\n");

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
        // RUN SYNC
        // ----------------------------------------

        await runHistoricalSync(
            user,
            leetcodeClient
        );

        console.log(
            "\n🎉 Sync test finished successfully."
        );

    } catch (error) {

        console.error(
            "\n❌ Sync test failed:"
        );

        console.error(
            error.message
        );

    } finally {

        await prisma.$disconnect();
    }
}

main();