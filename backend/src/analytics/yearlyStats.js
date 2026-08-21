const prisma = require("../db/prisma");


async function getYearlyStats(userId) {

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


    const yearlyStats = new Map();


    for (const solve of firstSolves) {

        const date =
            solve.firstSolvedAt.toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            );


        const year =
            date.substring(0, 4);


        if (!yearlyStats.has(year)) {

            yearlyStats.set(year, {
                year,
                newProblems: 0
            });
        }


        yearlyStats.get(year).newProblems++;
    }


    return Array.from(
        yearlyStats.values()
    );
}


module.exports = {
    getYearlyStats
};