# Verification Boundary

## Design rule

**A model may propose a verification plan. A model cannot create PASS by opinion.**

PinchQ separates planning from execution so the system can use adaptive reasoning without giving the planner direct process authority.

```text
Analyzer -> Planner -> Policy Validator -> Verification Plan -> Runner -> Evidence -> Verdict
```

## Planner

The planner can combine deterministic project discovery with optional model-assisted planning. Regardless of how a plan is produced, it must become the same typed `VerificationPlan` before execution.

The planner does not directly run shell commands, HTTP requests or browser actions.

## Policy validator

Before execution, a plan is checked against execution constraints such as denied commands and timeout bounds. This keeps “what would be useful to test” separate from “what the runtime is allowed to execute”.

## Runners

Runners are narrow adapters that observe real execution outcomes.

| Runner | Example evidence |
|---|---|
| Command | exit code, stdout, stderr, duration |
| HTTP | status, response body/assertions, duration |
| PTY / CLI | prompt-response interaction and exit state |
| Browser | DOM assertions, action trace, optional snapshots |

Domain-specific browser environment details belong to domain configuration, not to the generic BrowserRunner.

## Evidence

Representative evidence shape:

```json
{
  "check_id": "checkout-regression",
  "type": "command",
  "result": "PASS",
  "observed": {
    "exit_code": 0,
    "duration_ms": 1280
  },
  "provenance": {
    "source": "diff-analyzer",
    "rationale": "focused check selected from changed checkout module"
  }
}
```

The JSON above is synthetic and documents the demo contract, not a production record.

## Verdict precedence

```text
FAIL > PARTIAL > PASS
```

- Reproduced product failure → `FAIL`
- Required verification could not run → `PARTIAL`
- All required checks produced successful execution evidence → `PASS`

This prevents two common failure modes:

1. **Fake PASS** — treating a page load, model confidence or missing dependency as successful verification.
2. **False certainty** — converting an incomplete environment into a binary result.

See [`../evidence/verification-result.json`](../evidence/verification-result.json) for a synthetic aggregate result.
