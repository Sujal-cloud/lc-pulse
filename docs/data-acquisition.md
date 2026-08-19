# LC Pulse — Data Acquisition

## Objective

LC Pulse requires historical and incremental LeetCode submission data
to determine the first Accepted submission for each problem.

## Required Data

The minimum required submission information is:

- Problem identifier
- Problem title/slug
- Submission timestamp
- Submission status
- Programming language (optional)

## Processing Rule

Only Accepted submissions can establish a first-solved record.

For each problem, the earliest Accepted submission is considered the
first solve.

All subsequent submissions of that problem are treated as practice
activity.

## Synchronization Modes

### Initial Synchronization

The first synchronization must process historical submission data to
reconstruct the user's existing solving history.

### Incremental Synchronization

Subsequent synchronizations should process newly available submissions
and avoid creating duplicate records.

## Architecture Decision

LeetCode data acquisition will be isolated behind a dedicated adapter
layer.

This prevents changes to the external data source from affecting the
analytics, database, or frontend layers.

## Security

Authentication credentials, session cookies, and other private
credentials must never be committed to the repository.

Environment variables will be used for sensitive configuration.