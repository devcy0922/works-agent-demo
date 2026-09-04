# Public Sanitization Policy

This repository is a public portfolio for private operational software. Public material must be useful enough to explain the architecture without exposing company, customer or personal information.

## Never publish

- real usernames, employee names, email addresses or personal identifiers
- private IP addresses or internal DNS names
- company proxy endpoints, VPN/network layout or SSH targets
- production repository names that are not already intentionally public
- ticket IDs, customer IDs, account IDs or internal project codes
- real log lines containing identifiers, tokens, payloads or business data
- database hostnames, schema details or production queries that expose internal design
- authentication state, cookies, API keys, tokens, secrets or credential references that reveal real infrastructure
- production prompts, connector configuration or deployment manifests

## Synthetic replacements

Public examples use reserved or clearly fictional values such as:

- `example.test`
- `api.example.test`
- `example/checkout-service`
- `INC-DEMO-042`
- `app-logs-demo`
- `orders-readonly`

Measurements in sample evidence are synthetic unless a document explicitly says otherwise.

## Publication checklist

Before adding or updating public evidence:

1. Replace real hosts and URLs with `example.test` values.
2. Replace real repositories and ticket numbers with fictional identifiers.
3. Rewrite log content instead of redacting only one sensitive token from a real line.
4. Remove screenshots that include browser chrome, usernames, internal navigation, company branding or hidden metadata.
5. Do not copy production configuration and then “blank the password”; rebuild a minimal synthetic example instead.
6. Label synthetic artifacts with `"synthetic": true` or an equivalent visible note.
7. Do not publish measured performance or reliability claims without reproducible evidence.

## Public demo boundary

`index.html` and `app.js` contain a deterministic client-side simulation. They do not call private APIs, connect to real systems or execute external mutations.

The demo may display realistic workflow states, but it must not imply that the public repository contains the production agent, verification engine or backend.
