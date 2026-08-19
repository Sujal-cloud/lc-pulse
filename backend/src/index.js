require("dotenv").config();

const LeetCodeClient = require(
    "./services/leetcode/leetcodeClient"
);

const {
    calculateFirstSolves
} = require("./analytics/firstSolve");


async function main() {

    try {

        console.log(
            "🚀 LC Pulse backend starting..."
        );

        const client = new LeetCodeClient(
            process.env.LEETCODE_SESSION
        );

        await client.initialize();

        console.log(
            "✅ LeetCode client initialized."
        );

        const submissions = await client.getSubmissions(
            20,
            0
        );

        console.log(
            `📥 Retrieved ${submissions.length} submissions.`
        );

        const normalizedSubmissions =
            submissions.map(submission => ({
                title: submission.title,
                slug: submission.titleSlug,
                status: submission.statusDisplay,
                timestamp: Number(
                    submission.timestamp
                )
            }));

        const firstSolves =
            calculateFirstSolves(
                normalizedSubmissions
            );

        console.log(
            `🧠 First solves detected: ${firstSolves.size}`
        );

        console.log(
            "\nLC Pulse backend test complete."
        );

    } catch (error) {

        console.error(
            "\n❌ Backend error:"
        );

        console.error(error.message);
    }
}

main();