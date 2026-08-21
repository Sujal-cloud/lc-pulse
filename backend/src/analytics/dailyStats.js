const prisma = require("../db/prisma");


async function getDailyNewProblems(userId) {

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


    const dailyStats = new Map();


    for (const solve of firstSolves) {

        const date =
            solve.firstSolvedAt.toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            );


        if (!dailyStats.has(date)) {

            dailyStats.set(date, {
                date,
                newProblems: 0
            });
        }


        dailyStats.get(date).newProblems++;
    }


    return Array.from(
        dailyStats.values()
    );
}


module.exports = {
    getDailyNewProblems
};