const prisma = require("../src/db/prisma");

async function main() {
    try {
        const submissions =
            await prisma.submission.count();

        const problems =
            await prisma.problem.count();

        const userProblems =
            await prisma.userProblem.count();

        const users =
            await prisma.user.count();

        console.log("\nDATABASE COUNTS");
        console.log("====================");

        console.log(`Users:          ${users}`);
        console.log(`Submissions:    ${submissions}`);
        console.log(`Problems:       ${problems}`);
        console.log(`UserProblems:   ${userProblems}`);

    } catch (error) {

        console.error(error.message);

    } finally {

        await prisma.$disconnect();
    }
}

main();