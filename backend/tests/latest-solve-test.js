const prisma = require("../src/db/prisma");

async function main() {
    try {

        const user =
            await prisma.user.findUnique({
                where: {
                    leetcodeUsername: "sujal_codes"
                }
            });

        const latest =
            await prisma.userProblem.findMany({

                where: {
                    userId: user.id
                },

                orderBy: {
                    firstSolvedAt: "desc"
                },

                take: 10,

                include: {
                    problem: true
                }
            });

        console.log("\nLATEST FIRST SOLVES");
        console.log("==============================");

        for (const item of latest) {

            console.log(
                `${item.problem.title}`
            );

            console.log(
                `UTC : ${item.firstSolvedAt.toISOString()}`
            );

            console.log(
                `IST : ${item.firstSolvedAt.toLocaleString(
                    "en-IN",
                    {
                        timeZone: "Asia/Kolkata"
                    }
                )}`
            );

            console.log("------------------------------");
        }

    } catch (error) {

        console.error(error.message);

    } finally {

        await prisma.$disconnect();
    }
}

main();