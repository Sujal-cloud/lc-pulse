const prisma = require("../src/db/prisma");

async function main() {
    try {
        console.log("👤 Creating LC Pulse user...");

        const user = await prisma.user.upsert({
            where: {
                leetcodeUsername: "sujal_codes"
            },

            update: {},

            create: {
                leetcodeUsername: "sujal_codes"
            }
        });

        console.log("✅ User saved successfully.");

        console.log("\nUser:");
        console.log(`ID: ${user.id}`);
        console.log(`LeetCode: ${user.leetcodeUsername}`);

    } catch (error) {

        console.error("❌ Failed to save user.");
        console.error(error.message);

    } finally {

        await prisma.$disconnect();
    }
}

main();