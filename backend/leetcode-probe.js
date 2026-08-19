const { LeetCode, Credential } = require("leetcode-query");
require("dotenv").config();

const SESSION = process.env.LEETCODE_SESSION;

async function main() {
    if (!SESSION) {
        console.log("❌ LEETCODE_SESSION is missing from .env");
        return;
    }

    try {
        console.log("🔐 Initializing LeetCode authentication...");

        const credential = new Credential();
        await credential.init(SESSION);

        const leetcode = new LeetCode(credential);

        console.log("✅ Authentication initialized.\n");

        const PAGE_SIZE = 20;

        let offset = 0;

        let totalSubmissions = 0;
        let acceptedSubmissions = 0;

        const uniqueProblems = new Map();

        while (true) {

            console.log(`📥 Fetching offset: ${offset}`);

            const submissions = await leetcode.submissions({
                limit: PAGE_SIZE,
                offset: offset
            });

            if (submissions.length === 0) {
                console.log("\nNo more submissions.");
                break;
            }

            totalSubmissions += submissions.length;

            for (const submission of submissions) {

                if (submission.statusDisplay !== "Accepted") {
                    continue;
                }

                acceptedSubmissions++;

                const slug = submission.titleSlug;

                const timestamp = Number(
                    submission.timestamp
                );

                if (!uniqueProblems.has(slug)) {

                    uniqueProblems.set(slug, {
                        title: submission.title,
                        titleSlug: slug,
                        firstSolvedAt: timestamp
                    });

                } else {

                    const existing =
                        uniqueProblems.get(slug);

                    if (timestamp < existing.firstSolvedAt) {

                        existing.firstSolvedAt = timestamp;
                    }
                }
            }

            console.log(
                `   Retrieved: ${submissions.length}`
            );

            console.log(
                `   Total submissions: ${totalSubmissions}`
            );

            console.log(
                `   Accepted submissions: ${acceptedSubmissions}`
            );

            console.log(
                `   Unique problems: ${uniqueProblems.size}`
            );

            console.log();

            if (submissions.length < PAGE_SIZE) {
                console.log(
                    "Reached the end of submission history."
                );
                break;
            }

            offset += PAGE_SIZE;
        }

        console.log("\n====================================");
        console.log("       HISTORICAL ANALYSIS");
        console.log("====================================");

        console.log(
            `Total submissions: ${totalSubmissions}`
        );

        console.log(
            `Accepted submissions: ${acceptedSubmissions}`
        );

        console.log(
            `Unique problems: ${uniqueProblems.size}`
        );

        // Find earliest solved problem
        let earliest = null;

        for (const problem of uniqueProblems.values()) {

            if (
                earliest === null ||
                problem.firstSolvedAt < earliest.firstSolvedAt
            ) {
                earliest = problem;
            }
        }

        if (earliest) {

            const date = new Date(
                earliest.firstSolvedAt
            );

            console.log(
                `\nEarliest solved problem: ${earliest.title}`
            );

            console.log(
                `First solved: ${date.toLocaleString("en-IN")}`
            );
        }

        console.log("====================================");

    } catch (error) {

        console.log("\n❌ Historical analysis failed.");

        console.log(error.message);
    }
}

main();