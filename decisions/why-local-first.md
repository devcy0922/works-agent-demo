# Decision: Prefer Local-First Operational Context

## Context

Operational investigation often touches sensitive material: logs, repository context, internal documentation, database metadata and authentication-bound tools. Shipping all of that context to an external orchestration service by default increases the trust surface.

## Decision

The system is designed so sensitive operational context can remain close to the operator and the connected environment. Model execution may be local, cloud-backed or hybrid, but data access and execution policy remain application-owned.

## Principles

- credentials are configuration, not prompt content
- read/write permissions are explicit and scoped
- sensitive connector details are not embedded in public code or evidence
- investigation can run without granting mutation authority
- model routing does not own application memory, database access or external tool permissions

## Why not “cloud-only agent”

The goal is not to avoid cloud services categorically. The goal is to avoid making a remote model provider the owner of operational topology and authority.

A hybrid deployment can still use a cloud model for selected tasks while keeping:

- source retrieval
- secret resolution
- approval state
- audit records
- execution policy

inside the controlled application environment.

## Public portfolio note

This repository contains no real hosts, usernames, credentials, ticket identifiers or internal repository names. See [`../SANITIZATION.md`](../SANITIZATION.md).
