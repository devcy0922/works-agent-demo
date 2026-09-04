# Decision: Keep Mutation Behind Human Approval

## Context

Operational agents can gather enough context to propose useful actions, but the cost of an incorrect external mutation is asymmetric. A wrong summary is inconvenient; a wrong database write, ticket transition, repository mutation or production action may be expensive to reverse.

## Decision

Investigation and verification can be automated, but consequential mutation remains behind an explicit human approval gate.

```text
Investigate -> Propose -> Verify -> Evidence -> Human Approval -> Mutation
```

The approval boundary is durable workflow state. It is not implemented as a model asking itself whether the user “probably approves”.

## Consequences

### Benefits

- operator intent is explicit before external mutation
- evidence can be reviewed independently of model reasoning
- rejected actions remain auditable
- a verification `FAIL` or `PARTIAL` can block the normal approval path

### Cost

- fully autonomous execution is intentionally limited
- an operator remains in the critical path for consequential actions

This is an accepted trade-off. The product goal is not maximum autonomy; it is useful automation with accountable execution.
