const prisma = require("../src/db/prisma");

const {
    getYearlyStats
} = require("../src/analytics/yearlyStats");


async function main() {

    try {

        console.log("\n📈 YEARLY NEW-PROBLEM STATISTICS");
        console.log("=================================");

        const user =
            await prisma.user.findUnique({
                where: {
                    leetcodeUsername: "sujal_codes"
                }
            });

        if (!user) {
            throw new Error(
                "User sujal_codes not found."
            );
        }

        const yearlyStats =
            await getYearlyStats(user.id);

        for (const year of yearlyStats) {

            console.log(
                `${year.year} → ${year.newProblems} new problems`
            );
        }

        console.log("\nJSON OUTPUT");

        console.log(
            JSON.stringify(
                yearlyStats,
                null,
                2
            )
        );

    } catch (error) {

        console.error(
            "\n❌ Yearly analytics failed:"
        );

        console.error(
            error
        );

    } finally {

        await prisma.$disconnect();
    }
}

main();