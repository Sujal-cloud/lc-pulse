# LC Pulse — Product Requirements

## 1. Objective

Build a web application that measures genuine LeetCode problem-solving
progress by distinguishing first-time solves from repeated practice.

## 2. Primary Metric

### New Problem

A problem is considered new only when the user receives their first
Accepted submission for that problem.

### Practice

Any subsequent interaction with a previously solved problem is treated
as practice activity.

## 3. Daily Statistics

The application will provide a calendar-based view.

Selecting a date should display:

- Total unique problems solved up to that date
- New problems solved that day
- Practice activity
- Difficulty distribution
- Problems first solved that day

## 4. Monthly Statistics

For a selected month:

- Starting problem count
- Ending problem count
- New problems
- Average new problems per active day
- Active days
- Best day
- Difficulty distribution

## 5. Yearly Statistics

For a selected year:

- Starting problem count
- Current/ending problem count
- Total new problems
- Average per month
- Average per day
- Best month
- Best day

## 6. All-Time Statistics

- Total unique problems
- Total growth
- Overall solving velocity
- Long-term progress graph

## 7. Problem History

Each problem should maintain:

- Problem identifier
- Problem title
- Difficulty
- First solved date
- Practice/submission history

## 8. Integrations

### Required

- LeetCode

### Optional

- GitHub
- GeeksForGeeks

Optional integrations must not distort the core LeetCode statistics.

## 9. UI Principle

Daily statistics should not be represented by an infinitely growing
table.

A calendar should provide the primary navigation for daily activity,
with detailed statistics displayed after selecting a date.

## 10. Development Principle

Every major feature should be implemented through a meaningful,
documented development step.

Important technical decisions, challenges, and solutions should be
recorded in the project journal.