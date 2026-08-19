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

        const uniqueProblems = new Map();
        const activityDates = new Set();

        // ------------------------------------------
        // FETCH COMPLETE SUBMISSION HISTORY
        // ------------------------------------------

        while (true) {

            console.log(`📥 Fetching offset: ${offset}`);

            const submissions = await leetcode.submissions({
                limit: PAGE_SIZE,
                offset: offset
            });

            if (submissions.length === 0) {
                console.log("\n✅ Reached end of submission history.");
                break;
            }

            for (const submission of submissions) {

                // Every submission counts as an active day
                const submissionDate = new Date(
                    Number(submission.timestamp)
                );
            
                const dateString =
                    submissionDate.toLocaleDateString("en-CA", {
                        timeZone: "Asia/Kolkata"
                    });
                
                activityDates.add(dateString);
                
                
                // Only Accepted submissions matter for NEW problems
                if (submission.statusDisplay !== "Accepted") {
                    continue;
                }

                const slug = submission.titleSlug;
                const timestamp = Number(submission.timestamp);

                // First time seeing this problem
                if (!uniqueProblems.has(slug)) {

                    uniqueProblems.set(slug, {
                        title: submission.title,
                        titleSlug: slug,
                        firstSolvedAt: timestamp
                    });

                } else {

                    // We may encounter an older Accepted submission
                    // for the same problem.
                    const existing = uniqueProblems.get(slug);

                    if (timestamp < existing.firstSolvedAt) {
                        existing.firstSolvedAt = timestamp;
                    }
                }
            }

            console.log(
                `   Unique problems so far: ${uniqueProblems.size}`
            );

            if (submissions.length < PAGE_SIZE) {
                break;
            }

            offset += PAGE_SIZE;
        }

        // ------------------------------------------
        // DAILY FIRST-SOLVE COUNTS
        // ------------------------------------------

        const dailyNewProblems = new Map();

        for (const problem of uniqueProblems.values()) {

            const date = new Date(problem.firstSolvedAt);

            const dateString =
                date.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });

            if (!dailyNewProblems.has(dateString)) {
                dailyNewProblems.set(dateString, []);
            }

            dailyNewProblems
                .get(dateString)
                .push(problem);
        }

        // ------------------------------------------
        // SORT DATES
        // ------------------------------------------

        const sortedDates =
            [...dailyNewProblems.keys()].sort();

        // ------------------------------------------
        // DAILY TIMELINE
        // ------------------------------------------

        console.log("\n");
        console.log("========================================");
        console.log("        LC PULSE DAILY TIMELINE");
        console.log("========================================");

        let cumulativeTotal = 0;

        for (const date of sortedDates) {

            const problems = dailyNewProblems.get(date);

            cumulativeTotal += problems.length;

            console.log(
                `${date} → +${problems.length} new → ${cumulativeTotal} total`
            );

            for (const problem of problems) {

                console.log(
                    `    • ${problem.title}`
                );
            }
        }

        // ------------------------------------------
        // MONTHLY ANALYTICS
        // ------------------------------------------

        const monthlyStats = new Map();

        // First: calculate new problems
        for (const date of sortedDates) {
        
            const month = date.substring(0, 7);
        
            const newProblems =
                dailyNewProblems.get(date).length;
        
            if (!monthlyStats.has(month)) {
            
                monthlyStats.set(month, {
                    newProblems: 0,
                    newProblemDays: 0,
                    activeDays: 0
                });
            }
        
            const stats = monthlyStats.get(month);
        
            stats.newProblems += newProblems;
            stats.newProblemDays++;
        }


        // Second: calculate ALL active days
        for (const date of activityDates) {
        
            const month = date.substring(0, 7);
        
            if (!monthlyStats.has(month)) {
            
                monthlyStats.set(month, {
                    newProblems: 0,
                    newProblemDays: 0,
                    activeDays: 0
                });
            }
        
            const stats = monthlyStats.get(month);
        
            stats.activeDays++;
        }

        // ------------------------------------------
        // MONTHLY TIMELINE
        // ------------------------------------------

        console.log("\n");
        console.log("========================================");
        console.log("        LC PULSE MONTHLY ANALYTICS");
        console.log("========================================");

        let totalBeforeMonth = 0;

        for (const [month, stats] of monthlyStats) {

            const startingTotal = totalBeforeMonth;

            const endingTotal =
                startingTotal + stats.newProblems;

            const average =
                stats.activeDays === 0
                    ? 0
                    : stats.newProblems / stats.activeDays;

            console.log(`\n${month}`);

            console.log(
                `Starting total: ${startingTotal}`
            );

            console.log(
                `New problems:   +${stats.newProblems}`
            );

            console.log(
                `Ending total:   ${endingTotal}`
            );

            console.log(
                `Active days:    ${stats.activeDays}`
            );

            console.log(
                `New-problem days: ${stats.newProblemDays}`
            );

            console.log(
                `Avg new/day:    ${average.toFixed(2)}`
            );

            totalBeforeMonth = endingTotal;
        }

        // ------------------------------------------
        // FINAL SUMMARY
        // ------------------------------------------

        console.log("\n");
        console.log("========================================");
        console.log("             FINAL SUMMARY");
        console.log("========================================");

        console.log(
            `Unique problems: ${uniqueProblems.size}`
        );

        console.log(
            `First solve date: ${sortedDates[0]}`
        );

        console.log(
            `Latest solve date: ${sortedDates[sortedDates.length - 1]}`
        );

        console.log("========================================");

    } catch (error) {

        console.log("\n❌ Analytics generation failed.");

        console.log(error.message);
    }
}

main();