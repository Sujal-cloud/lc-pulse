const axios = require("axios");
require("dotenv").config();

const USERNAME = process.env.LEETCODE_USERNAME;
const URL = "https://leetcode.com/graphql";

const query = `
query userProfile($username: String!) {
    matchedUser(username: $username) {
        username
        profile {
            realName
            aboutMe
            userAvatar
            ranking
            reputation
        }
        submitStats {
            acSubmissionNum {
                difficulty
                count
            }
        }
    }
}
`;

async function main() {
    try {
        console.log(`Checking LeetCode user: ${USERNAME}...\n`);

        const response = await axios.post(
            URL,
            {
                query,
                variables: {
                    username: USERNAME
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const data = response.data;

        if (data.errors) {
            console.error("LeetCode returned an error:");
            console.error(data.errors);
            return;
        }

        const user = data.data.matchedUser;

        if (!user) {
            console.log("User not found.");
            return;
        }

        console.log("✅ User found!\n");

        console.log("Username:", user.username);
        console.log("Name:", user.profile.realName || "Not provided");
        console.log("Ranking:", user.profile.ranking);

        console.log("\nSolved problems:");

        for (const item of user.submitStats.acSubmissionNum) {
            console.log(
                `${item.difficulty}: ${item.count}`
            );
        }

    } catch (error) {
        console.error("\n❌ Request failed.");

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

main();