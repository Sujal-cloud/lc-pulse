const prisma = require("../db/prisma");


async function getMonthlyStats(userId) {

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


    const monthlyStats = new Map();


    for (const solve of firstSolves) {

        const date =
            solve.firstSolvedAt.toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            );


        const month =
            date.substring(0, 7);


        if (!monthlyStats.has(month)) {

            monthlyStats.set(month, {
                month,
                newProblems: 0
            });
        }


        monthlyStats.get(month).newProblems++;
    }


    return Array.from(
        monthlyStats.values()
    );
}


module.exports = {
    getMonthlyStats
};