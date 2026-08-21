const prisma = require("../src/db/prisma");

const {
    getCumulativeStats
} = require("../src/analytics/cumulativeStats");


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


        const cumulativeStats =
            await getCumulativeStats(
                user.id
            );


        console.log(
            "\n📈 CUMULATIVE PROGRESS"
        );

        console.log(
            "=============================="
        );


        console.log(
            JSON.stringify(
                cumulativeStats,
                null,
                2
            )
        );


        console.log(
            `\nTotal first solves: ${cumulativeStats.length}`
        );


    } catch (error) {

        console.error(
            "\n❌ Cumulative analytics failed:"
        );

        console.error(
            error.message
        );

    } finally {

        await prisma.$disconnect();
    }
}


main();