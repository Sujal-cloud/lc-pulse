# LC Pulse — Development Journal

## Day 1 — August 18, 2026

### Project Origin

The idea for LC Pulse came from my own experience practicing
LeetCode.

LeetCode provides useful activity metrics such as streaks and total
problems solved, but these metrics do not clearly distinguish between
solving a problem for the first time and revisiting a problem that has
already been solved.

Since I regularly revisit problems for practice, I wanted a way to
measure my actual rate of solving new problems.

For example, if I solve five problems in a day but three of them are
revisions, my actual new-problem progress is only two.

I could not find a tool focused specifically on this metric, which led
to the idea for LC Pulse.

### Initial Problem Statement

How can a developer accurately track their unique problem-solving
progress over time while separating first-time solves from repeated
practice?

### Initial Product Idea

LC Pulse will track the first Accepted solution of every problem and
associate it with the date on which the problem was first solved.

This historical data will be used to calculate daily, monthly, yearly,
and all-time problem-solving progress.

### Initial Product Decisions

1. Daily statistics will be accessed through a calendar rather than an
   infinitely growing daily table.

2. Selecting a date will display detailed statistics for that day.

3. New problems and repeated practice will be treated as separate
   metrics.

4. Monthly and yearly analytics will provide a higher-level view of
   progress.

5. LeetCode will be the primary integration.

6. GitHub and GeeksForGeeks may be added later as optional
   integrations.

7. The project will be developed incrementally rather than being
   created as one large initial commit.

### Why This Project Is Different

LC Pulse is not intended to be a general coding-profile aggregator.

Its primary purpose is longitudinal problem-solving analytics:
understanding how quickly a developer is actually learning and solving
new problems over time.

### Initial Tech Direction

The planned stack is:

- React
- JavaScript
- HTML/CSS
- Node.js
- Express
- MongoDB
- Chart.js

React will be learned and implemented progressively as part of the
project rather than being treated as a black box.

### What I Learned Today

- Defined the actual problem the project is solving.
- Distinguished activity from genuine new-problem progress.
- Defined the first Accepted submission as the source of truth for a
  new problem.
- Established the initial product scope.
- Decided to document the project throughout development.

### Next

- Design the system architecture.
- Design the database model.
- Define the data required from LeetCode.
- Define the API requirements.