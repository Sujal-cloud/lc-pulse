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

### Historical Reconstruction Validation

The reconstructed unique-problem count was initially compared against
an earlier LeetCode profile snapshot of 322 problems.

During development, one additional new problem was solved, bringing
the current LeetCode count to 323.

The historical submission reconstruction also produced 323 unique
Accepted problems.

This confirmed that the current processing logic correctly reconstructs
the user's unique solved-problem count from the available submission
history.

### Historical Analytics Prototype

The submission history was transformed into a first-solve timeline.

For each problem, the earliest Accepted submission was identified as
the problem's first solve.

This allowed the system to reconstruct:

- Daily new-problem counts
- Cumulative unique-problem totals
- Monthly new-problem counts
- Monthly starting and ending totals
- New-problem days
- Active submission days
- Average new problems per active day

The reconstructed data correctly reached 323 unique problems as of
August 19, 2026.

The August 2026 result was compared against the user's known progress
and matched the expected count.

### Activity vs Learning

During development, an important distinction was identified between
activity and learning progress.

An active day means the user made at least one submission, regardless
of whether the submission was Accepted.

A new-problem day means the user solved at least one problem for the
first time.

These metrics will therefore be tracked separately.

This distinction allows LC Pulse to recognize both practice activity
and genuine progress instead of treating every submission as a new
problem.

### Current Prototype Results

The historical data currently contains:

- 561 total submissions
- 465 Accepted submissions
- 323 unique problems
- First reconstructed solve: June 26, 2025
- Latest reconstructed solve: August 19, 2026

The prototype successfully reconstructs the user's unique-problem
history without storing pre-calculated daily totals.

### Day 2 Outcome

The core data acquisition and analytics assumptions have now been
validated.

LC Pulse can:

1. Authenticate with LeetCode locally.
2. Retrieve complete submission history.
3. Identify Accepted submissions.
4. Identify unique problems.
5. Determine each problem's first Accepted solve.
6. Reconstruct daily and monthly progress.
7. Distinguish activity from genuinely new problems.

The next phase will convert this validated prototype into the actual
application architecture and persistent data layer.

### Analytics Engine Testing

A separate analytics test module was created to validate the
first-solve detection logic using controlled submission data.

The following scenarios were tested successfully:

- First Accepted submission creates a new problem.
- Repeated Accepted submissions do not create duplicate problems.
- Wrong Answer submissions do not establish a first solve.
- The earliest Accepted timestamp is correctly selected even when
  submissions are provided out of chronological order.
- Multiple new problems on the same day are counted independently.

All five test cases passed.

This provides initial confidence that the first-solve detection logic
can correctly distinguish new problems from repeated practice.

### Day 3 — PostgreSQL & Prisma Persistence Layer

Day 3 focused on moving LC Pulse from an in-memory/prototype analytics
system to a persistent database-backed architecture.

### Database Setup

PostgreSQL was selected as the persistence layer, with Prisma ORM used
as the application's database access layer.

A managed Prisma PostgreSQL database was created and connected to the
backend through the `DATABASE_URL` environment variable.

Sensitive database credentials remain in environment variables and are
excluded from version control.

### Prisma Setup

Prisma 7 was initialized with PostgreSQL as the database provider.

The Prisma schema was designed around five core models:

- `User` — represents the LeetCode account being tracked.
- `Problem` — stores unique LeetCode problems.
- `Submission` — stores individual submission events.
- `UserProblem` — represents a problem solved by a specific user and
  stores its first-solved timestamp.
- `SyncRun` — records synchronization attempts and their results.

Daily, monthly, and yearly statistics were deliberately not stored as
primary database records. They will be derived from the underlying
submission and first-solve data.

This preserves a single source of truth and allows analytics to be
recalculated if the calculation logic changes.

### Database Migration

The initial Prisma migration was created and successfully applied.

The following tables were created:

- `User`
- `Problem`
- `Submission`
- `UserProblem`
- `SyncRun`

Prisma Client was generated and configured for the JavaScript backend
using the PostgreSQL driver adapter.

### Database Connectivity

A dedicated database connection module was created using Prisma and the
PostgreSQL adapter.

A database connectivity test successfully confirmed communication
between the Node.js backend and PostgreSQL.

The database initially contained no users.

### First Persistent User

The LeetCode account `sujal_codes` was inserted into the `User` table.

An `upsert` operation was used so that repeatedly running the operation
would not create duplicate user records.

### Historical Synchronization Prototype

A historical synchronization service was implemented to persist
LeetCode submission history.

The synchronization process:

1. Retrieves submissions from LeetCode.
2. Finds or creates the corresponding problem.
3. Stores each submission using its LeetCode submission ID.
4. Processes Accepted submissions separately.
5. Creates a `UserProblem` record when a problem is solved for the
   first time.
6. Preserves the earliest Accepted timestamp as `firstSolvedAt`.
7. Records the synchronization in `SyncRun`.

Submission IDs were made unique and `upsert` operations were used to
make synchronization safe to repeat without creating duplicate
records.

### 20-Submission Integration Test

Before importing the complete history, the synchronization process was
tested with 20 real LeetCode submissions.

The test produced:

- 20 submissions
- 15 unique problems
- 14 first-solved problems

The results were independently verified using Prisma Studio.

A bug was discovered in the initial `problemsFound` metric, where every
submission was counted rather than unique problems. This was corrected
by tracking problem IDs with a JavaScript `Set`.

### Data Integrity Verification

A database integrity test was created to compare the stored submission
data with the derived first-solve records.

The historical database snapshot contained:

- 565 submissions
- 334 unique problems
- 326 first-solve records

The number of unique Accepted problems was also 326, matching the number
of `UserProblem` records.

The earliest first solve was reconstructed as:

`Single Number — June 26, 2025`

This matched the historical analytics reconstructed during Day 2.

### Incremental Synchronization

An incremental synchronization service was implemented to process
submissions that were not already present in the database.

During testing, the database contained:

- 565 submissions
- 334 unique problems
- 326 first-solve records

The incremental synchronization detected:

- 6 new submissions
- 1 genuinely new solved problem

After synchronization:

- 571 submissions
- 335 unique problems
- 327 first-solve records

This validated one of LC Pulse's core concepts:

> Submission activity and genuine learning progress are different
> metrics.

Multiple submissions can represent the same problem, while only the
first Accepted solve creates a new `UserProblem` record.

### Day 3 Outcome

The persistence layer successfully connected the validated Day 2
analytics logic to a real PostgreSQL database.

LC Pulse can now:

1. Retrieve historical LeetCode submissions.
2. Persist submissions without duplicates.
3. Store unique problems.
4. Track first-solved timestamps.
5. Reconstruct the user's solved-problem history.
6. Synchronize newly submitted solutions incrementally.
7. Distinguish submission activity from genuinely new problems.

The next major stage is to build the analytics layer that derives
daily, monthly, yearly, cumulative, and learning-velocity statistics
from the persisted first-solve data.


### Day 4 — Historical Verification & Incremental Synchronization

Day 4 focused on verifying the persisted LeetCode history and making
LC Pulse capable of staying up to date without repeatedly rebuilding
the complete historical dataset.

### Historical Data Integrity

The PostgreSQL database was independently verified against the
historical analytics reconstructed during the earlier prototype phase.

The database contained:

- 565 submissions
- 334 unique problems
- 326 first-solve records

The number of unique Accepted problems was also 326, matching the
number of `UserProblem` records.

The earliest first solve was:

`Single Number — June 26, 2025`

This matched the previously reconstructed historical result.

The latest stored first solve was initially August 20, 2026, demonstrating
that the database represented a snapshot of the LeetCode account at the
time of the last synchronization rather than automatically updating
with new activity.

### Incremental Synchronization

An incremental synchronization service was implemented to detect and
persist submissions that were not already stored in PostgreSQL.

The synchronization checks recent LeetCode submissions against stored
submission IDs and processes only previously unseen submissions.

During the first incremental synchronization:

- 6 new submissions were detected.
- Only 1 of those submissions represented a genuinely new solved
  problem.

The database changed from:

- 565 submissions → 571 submissions
- 334 unique problems → 335 unique problems
- 326 first-solve records → 327 first-solve records

This confirmed the distinction between submission activity and genuine
learning progress.

### Core Product Validation

The incremental synchronization demonstrated the central purpose of
LC Pulse:

A user can make multiple submissions without necessarily increasing
their number of genuinely solved problems.

For example:

`6 new submissions → 1 new problem`

Therefore, LC Pulse can measure learning velocity independently from
submission activity or streaks.

### Day 4 Outcome

LC Pulse now has a persistent and incrementally synchronized data layer.

The system can:

1. Store historical LeetCode submissions.
2. Prevent duplicate submissions.
3. Store unique problems.
4. Track first-solved timestamps.
5. Detect newly submitted solutions.
6. Identify genuinely new solved problems.
7. Distinguish activity from learning progress.

The next stage is to build the analytics layer that transforms the
persisted first-solve data into daily, monthly, yearly, cumulative, and
learning-velocity statistics.

### First-Solve Definition

A "first solve" in LC Pulse is defined as the earliest Accepted
submission for a problem.

Wrong Answer, TLE, Runtime Error, or other unsuccessful submissions
do not create a UserProblem record.

Therefore, `UserProblem.firstSolvedAt` represents the timestamp of the
user's first successful (Accepted) solve of that problem.

### Day 4 — Analytics Engine & Backend API

The analytics layer was expanded to transform raw first-solve records
into meaningful learning statistics.

The system now derives statistics from `UserProblem.firstSolvedAt`
instead of storing pre-calculated statistics.

This keeps PostgreSQL as the single source of truth and allows analytics
to be recalculated whenever required.

### Analytics Implemented

The following analytics modules were created:

- Daily Statistics
- Monthly Statistics
- Yearly Statistics
- Cumulative Progress
- Learning Velocity

### Daily Statistics

Daily statistics calculate the number of genuinely solved problems on
each calendar date.

A solved problem is counted only when the user creates a
`UserProblem` record, meaning the problem has at least one Accepted
submission.

Timezone handling was added using the user's local timezone
(`Asia/Kolkata`) to ensure problems appear on the correct calendar date.

### Monthly and Yearly Statistics

Monthly and yearly aggregations were implemented by grouping
`firstSolvedAt` timestamps.

The results allow LC Pulse to display:

- Monthly learning progress
- Yearly growth comparison
- Long-term improvement trends

### Cumulative Progress

A cumulative progress system was created to reconstruct the user's
solved-problem journey over time.

Instead of only showing the current count, LC Pulse can now answer:

"How did my solved-problem count grow throughout my journey?"

Example:

- June 2025 → beginning of journey
- July 2026 → 291 solved problems
- August 21, 2026 → 328 solved problems

### Learning Velocity

A new metric called Learning Velocity was introduced.

Definition:

Learning Velocity =
Genuinely new problems solved / Learning-active days

A learning-active day is a day where at least one new problem was
solved.

This metric focuses on actual learning progress rather than submission
streaks or activity count.

### Express API Layer

The analytics modules were exposed through REST APIs.

Implemented endpoints:

GET /api/health

GET /api/stats/daily

GET /api/stats/monthly

GET /api/stats/yearly

GET /api/stats/cumulative

GET /api/stats/velocity


The backend now follows:

LeetCode
↓
Sync Service
↓
PostgreSQL
↓
Prisma
↓
Analytics Layer
↓
Express API

### Backend v1 Outcome

LC Pulse backend can now:

1. Synchronize LeetCode data.
2. Store historical submissions.
3. Track first successful solves.
4. Calculate learning statistics.
5. Serve analytics through APIs.

The backend is ready to be consumed by the frontend application.

**### Frontend Initialization**

The React frontend application was initialized using:

- React
- TypeScript
- Vite
- ESLint

The frontend structure was organized into separate layers:

src

↓

api layer

↓

components

↓

pages

↓

types


This separation keeps API communication, reusable UI components, and page-level logic independent.

**### API Integration**

Axios was introduced as the HTTP client for frontend-backend communication.

Reason:

Instead of directly calling APIs throughout components, Axios provides a centralized API layer with reusable configuration such as:

- Base URL management
- Future interceptors
- Consistent request handling


Implemented frontend connection:

React Dashboard

↓

Axios Client

↓

Express Statistics API

↓

Analytics Engine

↓

PostgreSQL


The dashboard successfully consumes real LC Pulse analytics data from:

GET /api/stats/daily


No mock data is used. The frontend is directly connected to the existing backend pipeline.

**### Frontend v1 Milestone**

LC Pulse frontend can now:

1\. Run as a React TypeScript application.

2\. Communicate with the backend REST API.

3\. Display real learning analytics data.

4\. Maintain a scalable structure for future dashboard features.


Next stage:

Build the premium LC Pulse analytics dashboard interface with summary cards, progress visualization, and calendar-based learning insights.

Next stage:
Build the React dashboard interface using the LC Pulse APIs.

Frontend Dashboard Foundation

- Created initial LC Pulse dashboard layout.
- Added summary sections for:
  - Problems Solved
  - Problems This Month
  - Learning Velocity
- Added placeholders for:
  - Progress Journey visualization
  - Learning Calendar

The dashboard structure was designed around learning insights rather than generic coding statistics.

Next stage:
Create reusable dashboard components and connect real analytics data.

**### Analytics Dashboard Foundation**

The first version of the LC Pulse dashboard interface was created.

Implemented:

- React dashboard layout
- Application navbar
- Reusable StatCard component
- Real analytics data integration

Connected metrics:

- Total Problems Solved
- Problems Solved This Month
- Learning Velocity


The frontend consumes analytics through REST APIs instead of calculating metrics locally.

Current data flow:

PostgreSQL

↓

Analytics Engine

↓

Express API

↓

Axios Client

↓

React Dashboard


The dashboard UI was designed around the concept of measuring learning progress rather than showing simple activity statistics.

Added a SaaS-style interface with:

- Dark theme
- Glassmorphism cards
- Premium spacing
- Product-focused sections


Next stage:

Build interactive analytics visualizations using cumulative progress data.


Axios provides a centralized HTTP client layer instead of directly calling fetch everywhere. It allows reusable configuration like base URLs and interceptors.
