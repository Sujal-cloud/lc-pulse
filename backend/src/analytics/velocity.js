const prisma = require("../db/prisma");


async function getLearningVelocity(userId) {

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


    const monthlyData = new Map();


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


        if (!monthlyData.has(month)) {

            monthlyData.set(month, {
                month,
                newProblems: 0,
                activeDays: new Set()
            });
        }


        const data =
            monthlyData.get(month);


        data.newProblems++;

        data.activeDays.add(date);
    }


    return Array.from(
        monthlyData.values()
    ).map(data => {

        const activeDays =
            data.activeDays.size;

        const velocity =
            activeDays === 0
                ? 0
                : data.newProblems / activeDays;


        return {
            month: data.month,

            newProblems:
                data.newProblems,

            activeDays,

            velocity:
                Number(velocity.toFixed(2))
        };
    });
}


module.exports = {
    getLearningVelocity
};