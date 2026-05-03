# Security Specification: Income & Expense Tracker

## Data Invariants
1. A transaction MUST have a valid `userId` matching the authenticated user.
2. A transaction MUST have a `date`.
3. Financial fields (`incomeLAK`, `incomeTHB`, `expenseLAK`, `expenseTHB`) MUST be non-negative numbers.
4. `createdAt` MUST be set to current server time on creation and remains immutable.
5. `updatedAt` MUST be updated to current server time on every update.

## The Dirty Dozen Payloads (Target: /transactions/{id})

1. **Identity Spoofing**: Creating a transaction with someone else's `userId`.
2. **Missing Date**: Creating a transaction without a required `date`.
3. **Negative Income**: Setting `incomeLAK` to `-1000`.
4. **Massive String Poisoning**: Setting `refName` to a 500KB string.
5. **Unauthorized Read**: Authenticated user trying to read another user's transactions.
6. **Ghost update**: Updating a transaction and changing the `userId` to take ownership.
7. **Bypassing Server Timestamps**: Providing a client-side `createdAt` in the future.
8. **Shadow Field Injection**: Adding an `isAdmin: true` field to a transaction document.
9. **Bulk Delete**: Attempting to delete documents owned by others.
10. **Type Mismatch**: Sending a string for the `incomeLAK` field.
11. **Orphaned Writes**: Creating a transaction with an invalid ID format.
12. **PII Leak**: Querying the entire collection without a `userId` filter (Scraping).

## Test Runner (Logic)
All the above payloads MUST return `PERMISSION_DENIED`.
Rules must enforce:
- `isOwner(resource.data.userId)`
- `isValidTransaction(incoming())`
- `affectedKeys().hasOnly(...)`
