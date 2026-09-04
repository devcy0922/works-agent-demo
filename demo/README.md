# Demo Contract

The demo is intentionally small and deterministic.

## What it demonstrates

- one work event becomes a durable-style case
- investigation collects scoped synthetic evidence
- Works produces a proposed action without mutation
- PinchQ owns the verification stage
- runner evidence produces `PASS / PARTIAL / FAIL`
- human approval is available only when the demo verdict is `PASS`

## What it does not demonstrate

- production LLM quality
- production connectors
- real database or log retrieval
- production latency or throughput
- private prompts or policies
- external writes

## Scenario semantics

### PASS

All three representative checks produce passing observations.

### PARTIAL

The API and command checks pass, but the browser check cannot complete because of an environmental dependency. The demo does not infer PASS.

### FAIL

The focused regression check reproduces a failure. The aggregate result stays FAIL even when the health and browser checks pass.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

No package installation, API key or backend is required.

The executable reference path is separate from this browser-only visual demo:

```bash
python3 -m pip install -e . pytest
pytest -q
```
