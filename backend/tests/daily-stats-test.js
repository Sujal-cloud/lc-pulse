const prisma = require("../src/db/prisma");

const {
    getDailyNewProblems
} = require("../src/analytics/dailyStats");


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


        const dailyStats =
            await getDailyNewProblems(
                user.id
            );


        console.log(
            "\n📅 DAILY NEW-PROBLEM STATISTICS"
        );

        console.log(
            "================================"
        );


        for (const day of dailyStats) {

            console.log(
                `${day.date} → ${day.newProblems} new problems`
            );
        }


        console.log(
            `\nDays with new problems: ${dailyStats.length}`
        );


        console.log(
            "\nJSON OUTPUT"
        );

        console.log(
            JSON.stringify(
                dailyStats,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\n❌ Daily analytics failed:"
        );

        console.error(
            error.message
        );

    } finally {

        await prisma.$disconnect();
    }
}


main();