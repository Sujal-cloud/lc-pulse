# LC Pulse — Development Journal

### Day 1 — Architecture Discussion

The initial architecture was designed around separating data acquisition,
data processing, persistence, API delivery, and frontend presentation.

The application will not store daily totals as its primary source of
truth. Instead, individual problems and submission events will be stored,
allowing daily, monthly, yearly, and all-time statistics to be derived
from the underlying data.

A sync layer will be placed between LeetCode and the application so that
changes to the method of obtaining LeetCode data do not require changes
to the frontend or analytics system.

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