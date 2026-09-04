# Synthetic Incident Report

> Portfolio example only. All identifiers, observations and measurements below are fictional.

## Case

- **ID:** `INC-DEMO-042`
- **Title:** Checkout latency spike
- **Priority:** High
- **Investigation policy:** Read-only

## What was observed

The demo investigation correlates the synthetic latency spike with requests in which an optional currency field is missing. A fictional recent repository change touches the same checkout serialization path.

### Evidence used

| Source | Observation |
|---|---|
| `app-logs-demo` | Latency/error path appears when optional currency metadata is absent. |
| `orders-readonly` | Synthetic fixture includes a null optional currency value. |
| `example/checkout-service` | Fictional recent diff touches checkout serialization. |

## Proposed action

Add a null guard around the optional currency field and add a focused regression test for the missing-value path.

**Mutation state:** not executed.

## Verification

PinchQ receives the proposed change boundary and produces executable evidence.

| Check | Type | Result | Observed evidence |
|---|---|---:|---|
| Health endpoint | HTTP | PASS | status `200` |
| Focused regression | Command | PASS | exit code `0` |
| Checkout smoke flow | Browser | PASS | DOM assertions + synthetic snapshots |

### Aggregate verdict

`PASS`

The verdict is based on runner observations, not an LLM confidence score.

## Approval state

`AWAITING_HUMAN`

The public demo stops at approval. It never writes to a repository, database, ticket system or production service.
