const { LeetCode, Credential } = require("leetcode-query");
require("dotenv").config();

const SESSION = process.env.LEETCODE_SESSION;

async function main() {
    if (!SESSION) {
        console.log("❌ LEETCODE_SESSION is missing from .env");
        return;
    }

    try {
        console.log("🔐 Initializing LeetCode authentication...");

        const credential = new Credential();

        await credential.init(SESSION);

        const leetcode = new LeetCode(credential);

        console.log("✅ Authentication initialized.");
        console.log("📥 Fetching submissions...\n");

        const result = await leetcode.submissions({
            limit: 20,
            offset: 0
        });

        console.log("Raw result:");
        console.dir(result, { depth: null });

    } catch (error) {
        console.log("\n❌ Historical submission probe failed.");
        console.log(error.message);
    }
}

main();