# LC Pulse — Development Journal

## Day 1 — August 18, 2026

### Project Origin

The idea for LC Pulse came from my own experience practicing LeetCode.

LeetCode provides useful activity metrics such as streaks and total
problems solved, but these metrics do not clearly distinguish between
solving a problem for the first time and revisiting a problem that has
already been solved.

Since I regularly revisit problems for practice, I wanted a way to
measure my actual rate of solving new problems.

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
- PostgreSQL
- Prisma
- Chart.js

React will be learned and implemented progressively as part of the
project rather than being treated as a black box.

### Architecture Discussion

The initial architecture was designed around separating data
acquisition, data processing, persistence, API delivery, and frontend
presentation.

The application will not store daily totals as its primary source of
truth. Instead, individual problems and submission events will be
stored, allowing daily, monthly, yearly, and all-time statistics to be
derived from the underlying data.

A sync layer will be placed between LeetCode and the application so
that changes to the method of obtaining LeetCode data do not require
changes to the frontend or analytics system.

### Important Design Decision

The system must support two types of synchronization:

1. Initial historical synchronization to reconstruct previous
   first-solved dates.
2. Incremental synchronization to process newly submitted solutions.

### New Metric: Learning Velocity

LC Pulse will measure the rate of solving genuinely new problems,
including short-term and long-term velocity, rather than relying only
on activity streaks.

### Key Challenge Identified

Historical data is essential because the purpose of LC Pulse is to show
long-term progress rather than only activity after the application is
installed.

### Database Decision

PostgreSQL was selected as the database for LC Pulse.

The application's core data is relational, with users, problems,
submissions, and first-solved records having clear relationships.
The application will also rely heavily on historical queries and
aggregation for daily, monthly, yearly, and all-time analytics.

PostgreSQL was therefore chosen because its relational model,
constraints, and SQL aggregation capabilities are a strong fit for
the application's requirements.

Prisma will be used as the ORM to provide a structured interface
between the Node.js backend and PostgreSQL.

### What I Learned

- Defined the actual problem the project is solving.
- Distinguished activity from genuine new-problem progress.
- Defined the first Accepted submission as the source of truth for a
  new problem.
- Established the initial product scope.
- Designed the initial system architecture.
- Chose PostgreSQL based on the application's data requirements.
- Decided to document the project throughout development.

### Day 1 Outcome

The product requirements, initial architecture, database direction,
and development methodology were established.

---

## Day 2 — August 19, 2026

### Objective

Validate whether LeetCode provides enough data for LC Pulse to
reconstruct historical problem-solving progress and continuously
synchronize new activity.

### LeetCode Profile Probe

A Node.js data probe was created to communicate with LeetCode's
GraphQL endpoint.

The probe successfully retrieved real profile data for the account
`sujal_codes`.

The retrieved statistics matched the current LeetCode profile,
including the total number of solved problems and the difficulty
breakdown.

This confirmed that the backend can communicate with LeetCode and
retrieve live account data.

### Submission Calendar Probe

The data probe was extended to retrieve LeetCode's submission calendar.

Real submission activity was successfully returned for the account.

This confirmed that LeetCode provides timestamped daily activity data.

However, the calendar represents submission activity rather than
genuinely new problems.

For example, a day with seven submissions could contain four new
problems and three repeated problems.

Therefore, the LeetCode submission calendar cannot be used as the
primary metric for LC Pulse's new-problem analytics.

### Recent Accepted Submission Probe

The probe was extended to retrieve recent Accepted submissions.

The response successfully provided information including:

- Problem title
- Problem slug
- Submission timestamp
- Submission identifier

This provided the information required to begin distinguishing
different problem submissions.

### Authenticated Submission Access

An authenticated LeetCode submission probe was successfully tested.

This confirmed that LC Pulse can access submission history beyond the
public recent-submission endpoint.

The authentication credentials are stored locally through environment
variables and are excluded from version control.

No authentication credentials are stored in the repository.

### Data Acquisition Milestones

- Public profile data successfully retrieved.
- Current solved-problem statistics successfully retrieved.
- Submission calendar successfully retrieved.
- Recent Accepted submissions successfully retrieved.
- Authenticated submission history successfully retrieved.

### Important Technical Finding

The public LeetCode data is sufficient for several profile and activity
features, but complete historical reconstruction requires authenticated
submission access.

This means the LeetCode integration should remain isolated behind a
dedicated synchronization layer.

### Current Architecture

The validated data flow is:

LeetCode
↓
LeetCode Data Adapter
↓
Submission Processing
↓
PostgreSQL
↓
Express API
↓
React Frontend

### Next Step

Test pagination of the authenticated submission history to determine
whether the complete submission history can be retrieved.

The next goal is to process the historical submissions and determine
whether the system can reconstruct the user's current unique solved
problem count.

The reconstructed count should eventually be compared with LeetCode's
reported total to validate the processing logic.