const { LeetCode, Credential } = require("leetcode-query");

class LeetCodeClient {

    constructor(session) {
        this.session = session;
        this.leetcode = null;
    }

    async initialize() {

        if (!this.session) {
            throw new Error(
                "LEETCODE_SESSION is missing"
            );
        }

        const credential = new Credential();

        await credential.init(this.session);

        this.leetcode = new LeetCode(credential);
    }

    async getSubmissions(
        limit = 20,
        offset = 0
    ) {

        if (!this.leetcode) {
            throw new Error(
                "LeetCode client has not been initialized"
            );
        }

        return await this.leetcode.submissions({
            limit,
            offset
        });
    }
}

module.exports = LeetCodeClient;