function calculateFirstSolves(submissions) {

    const uniqueProblems = new Map();

    for (const submission of submissions) {

        if (submission.status !== "Accepted") {
            continue;
        }

        const existing = uniqueProblems.get(
            submission.slug
        );

        if (!existing) {

            uniqueProblems.set(
                submission.slug,
                {
                    title: submission.title,
                    firstSolvedAt: submission.timestamp
                }
            );

        } else if (
            submission.timestamp < existing.firstSolvedAt
        ) {

            existing.firstSolvedAt =
                submission.timestamp;
        }
    }

    return uniqueProblems;
}


// ==========================================
// TEST 1
// ==========================================

const test1 = [
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 100
    }
];

console.log(
    "Test 1:",
    calculateFirstSolves(test1).size === 1
        ? "PASS"
        : "FAIL"
);


// ==========================================
// TEST 2
// ==========================================

const test2 = [
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 100
    },
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 200
    }
];

console.log(
    "Test 2:",
    calculateFirstSolves(test2).size === 1
        ? "PASS"
        : "FAIL"
);


// ==========================================
// TEST 3
// ==========================================

const test3 = [
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Wrong Answer",
        timestamp: 100
    },
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 200
    }
];

const result3 = calculateFirstSolves(test3);

console.log(
    "Test 3:",
    result3.get("two-sum")?.firstSolvedAt === 200
        ? "PASS"
        : "FAIL"
);


// ==========================================
// TEST 4
// ==========================================

const test4 = [
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 200
    },
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 100
    }
];

const result4 = calculateFirstSolves(test4);

console.log(
    "Test 4:",
    result4.get("two-sum")?.firstSolvedAt === 100
        ? "PASS"
        : "FAIL"
);


// ==========================================
// TEST 5
// ==========================================

const test5 = [
    {
        title: "Two Sum",
        slug: "two-sum",
        status: "Accepted",
        timestamp: 100
    },
    {
        title: "Binary Search",
        slug: "binary-search",
        status: "Accepted",
        timestamp: 100
    },
    {
        title: "LRU Cache",
        slug: "lru-cache",
        status: "Accepted",
        timestamp: 100
    }
];

console.log(
    "Test 5:",
    calculateFirstSolves(test5).size === 3
        ? "PASS"
        : "FAIL"
);