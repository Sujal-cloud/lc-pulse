const prisma = require("../src/db/prisma");

const {
    getLearningVelocity
} = require("../src/analytics/velocity");


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
                "User sujal_codes not found."
            );
        }


        const velocity =
            await getLearningVelocity(
                user.id
            );


        console.log(
            "\n⚡ LEARNING VELOCITY"
        );

        console.log(
            "=============================="
        );


        for (const month of velocity) {

            console.log(
                `${month.month} → ` +
                `${month.newProblems} problems / ` +
                `${month.activeDays} learning days = ` +
                `${month.velocity} problems/day`
            );
        }


        console.log("\nJSON OUTPUT");

        console.log(
            JSON.stringify(
                velocity,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\n❌ Velocity calculation failed:"
        );

        console.error(error);

    } finally {

        await prisma.$disconnect();
    }
}


main();