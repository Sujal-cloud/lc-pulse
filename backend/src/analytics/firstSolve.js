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

module.exports = {
    calculateFirstSolves
};