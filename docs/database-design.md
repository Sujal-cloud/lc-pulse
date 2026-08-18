# LC Pulse — Database Design

## Core Entities

### User

Stores the user's account and synchronization information.

Fields:

- id
- leetcodeUsername
- displayName
- timezone
- createdAt
- lastSyncedAt

### Problem

Stores information about a LeetCode problem.

Fields:

- id
- leetcodeId
- title
- slug
- difficulty
- topics

### UserProblem

Represents a problem solved by a specific user.

Fields:

- id
- userId
- problemId
- firstSolvedAt
- firstSolvedDate
- practiceCount

Constraint:

- userId + problemId must be unique

### Submission

Stores individual submission events.

Fields:

- id
- userId
- problemId
- submittedAt
- date
- status
- language

## Source of Truth

Problems and submissions are the primary source of truth.

Analytics will be derived from these records.

## New Problem Definition

A problem is considered a new problem when the user receives their
first Accepted submission for that problem.

All subsequent submissions of the same problem are treated as
practice activity.

## Daily Statistics

Daily statistics can be derived by grouping first-solved records by
firstSolvedDate.

For example:

August 18:
- 4 first solves
- 3 practice submissions

Total unique problems are calculated from all problems solved up to
that date.

## Historical Data

The system must support an initial historical synchronization so that
existing LeetCode progress can be reconstructed rather than starting
from the date LC Pulse is created.