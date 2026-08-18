# LC Pulse — System Architecture

## Overview

LC Pulse will use a layered architecture that separates data
acquisition, data processing, persistence, API delivery, and
presentation.

## Architecture

LeetCode
   ↓
Sync Layer
   ↓
Data Processing
   ↓
PostgreSQL
   ↓
Express API
   ↓
React Frontend

## Frontend

React will be responsible for:

- Dashboard
- Activity calendar
- Daily statistics
- Monthly analytics
- Yearly analytics
- Problem explorer
- Data visualization

## Backend

Node.js and Express will be responsible for:

- API endpoints
- LeetCode synchronization
- Submission processing
- First-solve detection
- Analytics calculations
- Database communication

## Database

PostgreSQL will store:

- Users
- Problems
- User-problem relationships
- Submission history

Prisma will be used as the ORM.

## Data Principle

The application will store underlying problem and submission data as
the primary source of truth.

Daily, monthly, yearly, and all-time statistics will be derived from
this data rather than being treated as independent sources of truth.

## Synchronization

The application will support:

### Initial Synchronization

Used when connecting a LeetCode account for the first time.

The system will process historical submissions to reconstruct the
user's first-solved history.

### Incremental Synchronization

Used after the initial synchronization.

The system will process newly available submissions and update the
user's statistics without duplicating existing records.

## Future Integrations

The architecture should allow additional coding platforms such as
GeeksForGeeks and GitHub to be integrated without changing the core
LeetCode analytics system.