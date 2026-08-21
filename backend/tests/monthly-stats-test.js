const prisma = require("../src/db/prisma");

const {
    getMonthlyStats
} = require("../src/analytics/monthlyStats");


async function main() {

    try {

        const user =
            await prisma.user.findUnique({

                where: {
                    leetcodeUsername:
                        "sujal_codes"
                }
            });


        if (!user) {
            throw new Error(
                "User not found."
            );
        }


        const monthlyStats =
            await getMonthlyStats(
                user.id
            );


        console.log(
            "\n📊 MONTHLY NEW-PROBLEM STATISTICS"
        );

        console.log(
            "=================================="
        );


        for (const month of monthlyStats) {

            console.log(
                `${month.month} → ${month.newProblems} new problems`
            );
        }


        console.log(
            "\nJSON OUTPUT"
        );

        console.log(
            JSON.stringify(
                monthlyStats,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\n❌ Monthly analytics failed:"
        );

        console.error(
            error.message
        );

    } finally {

        await prisma.$disconnect();
    }
}


main();