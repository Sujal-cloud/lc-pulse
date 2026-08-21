const prisma = require("../src/db/prisma");

async function main() {
    try {
        console.log("🔌 Connecting to PostgreSQL...");

        const users = await prisma.user.findMany();

        console.log("✅ Database connection successful.");

        console.log(
            `👤 Users currently in database: ${users.length}`
        );

    } catch (error) {

        console.error("❌ Database connection failed.");
        console.error(error.message);

    } finally {

        await prisma.$disconnect();
    }
}

main();