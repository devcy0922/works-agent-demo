# Decision: Evidence, Not LLM Judgment, Creates the Verdict

## Context

A language model can review code, propose tests and estimate risk. Those are useful planning capabilities, but they are not direct observations of runtime behavior.

If the same model both proposes a change and declares the change correct, the system collapses planning and verification into one probabilistic judgment.

## Decision

PinchQ treats the planner as a producer of a typed verification plan. Only runner execution can produce evidence used by the final verdict.

```text
Model / deterministic planner
          ↓
VerificationPlan
          ↓
Policy validation
          ↓
Executable runners
          ↓
Observed Evidence
          ↓
PASS / FAIL / PARTIAL
```

## Why `PARTIAL` exists

Binary success/failure is insufficient when the environment prevents a required check from running.

Example:

- API check passed.
- Unit test passed.
- Browser runtime was unavailable.

Calling this `PASS` would manufacture certainty. Calling it `FAIL` would claim a product defect that was not reproduced. `PARTIAL` preserves the actual state: evidence is incomplete.

## Aggregate precedence

```text
FAIL > PARTIAL > PASS
```

A reproduced failure remains a failure even if other checks pass.

## Consequence

The verification layer can use AI without turning model confidence into an execution fact. This is the primary boundary that separates the system from an “LLM judge” wrapper.
