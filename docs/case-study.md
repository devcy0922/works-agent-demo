# Case Study — From Operational Event to Verified Proposal

## Problem

Operational work often arrives as incomplete context: an alert, a support question, a ticket, a repository change or a short message. The operator then has to gather logs, inspect database state, find related work, reason about the likely cause, propose an action, run checks and decide whether the action is safe.

A generic chat assistant can help with individual steps, but it usually does not own the durable state, connected evidence, execution policy and approval boundary required to turn that work into a repeatable operating workflow.

## System goal

The private system behind this portfolio was designed around one question:

> How can AI reduce the investigation and coordination cost without turning model confidence into execution authority?

The resulting architecture separates investigation from verification and verification from consequence.

## System split

### Works Agent Runtime

Works owns the business lifecycle.

- receives work events
- binds a workspace/profile
- collects scoped evidence
- runs bounded analysis tasks
- produces findings and a proposed action
- tracks durable case state
- exposes the approval boundary
- records audit events

### PinchQ Verification Engine

PinchQ owns executable verification.

- inspects repository/diff signals
- builds a typed verification plan
- validates the plan against policy
- executes command / HTTP / PTY / browser checks
- records observed evidence
- aggregates `PASS / FAIL / PARTIAL`

The two systems are intentionally separate. Verification is not absorbed into the agent loop because the agent that proposes an action should not be able to declare the same action correct by opinion.

## Representative synthetic scenario

The public demo uses a fictional checkout incident.

```text
Alert webhook
    ↓
Works creates INC-DEMO-042
    ↓
Read-only synthetic logs + DB + repository context
    ↓
Finding: missing optional currency value correlates with failure path
    ↓
Proposal: null guard + focused regression test
    ↓
PinchQ inspects the change boundary
    ↓
HTTP + command + browser verification
    ↓
Evidence
    ↓
PASS / PARTIAL / FAIL
    ↓
Human approval
```

The demo exposes three possible endings because the distinction is part of the architecture, not an error message detail.

### PASS

All required checks produced successful execution evidence. The human approval action becomes available.

### PARTIAL

Some checks passed, but a required check could not run. The system preserves uncertainty instead of silently promoting the result to PASS.

### FAIL

A product failure was reproduced. Passing checks elsewhere cannot override the failure because aggregate precedence is `FAIL > PARTIAL > PASS`.

## Key engineering decisions

### 1. Planner and Runner are different authorities

The planner can use deterministic rules and optional model assistance to decide what should be checked. The runner is the only component that executes the check and records what happened.

### 2. Human approval is durable state

Approval is not a conversational convention. Investigation can finish, the execution worker can terminate, and the case can remain waiting for a human decision.

### 3. Local-first does not mean local-model-only

The system can route inference to local, cloud or hybrid model endpoints. Local-first refers to application ownership of operational context, credentials, policy and connected data.

### 4. Domain knowledge stays outside generic runners

A generic browser runner should know how to navigate, click, fill, select, assert and capture evidence. Proxy settings, secondary-auth patterns and application-specific error strings belong to domain configuration.

## Failure handling

The system distinguishes failures by ownership.

| Failure | Expected behavior |
|---|---|
| transient model gateway failure | fail fast at the orchestration boundary and allow the execution backend to retry |
| one bounded analysis worker fails | degrade that worker when the remaining evidence can still support investigation |
| required evidence source is missing | report the missing scope; do not fabricate evidence |
| verification dependency is unavailable | `PARTIAL` |
| product regression is reproduced | `FAIL` |
| verification is complete and passing | expose human approval |

## Why this is not a public source mirror

The production implementations contain operational connectors, environment profiles and company-specific integration details that should not be published. A stripped source dump would either leak information or remove so much context that it would no longer demonstrate the system meaningfully.

This repository instead publishes:

- the architecture contracts
- the system boundaries
- engineering decisions
- synthetic evidence shapes
- a deterministic interactive demo
- the sanitization policy used for public material

That makes the portfolio claim narrower but more verifiable: it shows **how the system is designed and what evidence it is supposed to produce**, without presenting private implementation as public OSS.

## Limits of this public demo

The browser demo is not connected to a production backend. It does not prove production reliability, latency or scale. It proves only the public state-machine contract represented in the UI.

No performance numbers or automated-test counts are claimed in this repository unless separately published with reproducible evidence.
