const prisma = require("../db/prisma");


async function getCumulativeStats(userId) {

    const firstSolves =
        await prisma.userProblem.findMany({

            where: {
                userId
            },

            select: {
                firstSolvedAt: true
            },

            orderBy: {
                firstSolvedAt: "asc"
            }
        });


    const cumulativeByDate = new Map();

    let cumulative = 0;


    for (const solve of firstSolves) {

        cumulative++;


        const date =
            solve.firstSolvedAt.toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            );


        // If multiple problems were solved on the
        // same date, keep updating the final total
        // for that date.
        cumulativeByDate.set(
            date,
            cumulative
        );
    }


    return Array.from(
        cumulativeByDate.entries()
    ).map(
        ([date, totalSolved]) => ({
            date,
            totalSolved
        })
    );
}


module.exports = {
    getCumulativeStats
};