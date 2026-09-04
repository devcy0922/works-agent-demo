# Works Agent System — Public Evidence Portfolio

> AI가 결정을 대신하는 시스템이 아니라, **AI가 조사하고 제안하며 실행 결과를 검증 가능한 Evidence로 만든 뒤 사람이 최종 결정하는 업무 자동화 시스템**입니다.

이 저장소는 두 개의 private implementation을 하나의 시스템 관점에서 설명하는 공개 포트폴리오입니다.

- **Works Agent Runtime** — 업무 인입, 조사, 분석, 제안, 승인 수명주기
- **PinchQ Verification Engine** — 변경 분석, 검증 계획, 실제 실행 Evidence, `PASS / FAIL / PARTIAL`

실제 제품 소스, 프롬프트, 배포 구성, 사내 connector, 운영 데이터는 공개하지 않습니다. 이 저장소의 인터랙티브 데모와 Evidence는 모두 **synthetic / anonymized data**입니다.

## Live-style demo

루트의 `index.html`은 별도 backend 없이 동작하는 deterministic portfolio demo입니다.

```bash
python3 -m http.server 8080
# http://localhost:8080
```

데모에서는 세 가지 검증 결과를 선택할 수 있습니다.

- `PASS` — 모든 필수 검증이 실행 Evidence로 통과
- `PARTIAL` — 환경/의존성 제약으로 일부 검증을 완료하지 못함
- `FAIL` — 실제 실패가 재현됨

최종 승인 버튼은 `PASS`일 때만 활성화됩니다. 이는 실제 시스템의 모든 세부 구현을 복제한 것이 아니라, 핵심 trust boundary를 공개 가능한 형태로 축약한 것입니다.

## System flow

```mermaid
flowchart TD
    A[Work Event] --> B[Works Agent Runtime]
    B --> C[Collect / Investigate / Analyze]
    C --> D[Proposed Action]
    D --> E[PinchQ Verification Engine]
    E --> F[Inspect]
    F --> G[Plan]
    G --> H[Execute deterministic runners]
    H --> I[Evidence]
    I --> J{Verdict}
    J -->|PASS| K[Human Approval Gate]
    J -->|PARTIAL| L[Human Review / Missing Evidence]
    J -->|FAIL| M[Reject / Rework]
    K --> N[Approved Action]
```

## Responsibility boundary

| Area | Owner |
|---|---|
| Work event intake | Works |
| DB / log / knowledge investigation | Works |
| LLM-assisted analysis | Works |
| Proposed action | Works |
| Change inspection | PinchQ |
| Verification planning | PinchQ |
| Command / HTTP / PTY / browser execution | PinchQ |
| Evidence & verdict | PinchQ |
| Human approval | Works |
| Audit trail | Works |

핵심 원칙은 **Planner와 Runner를 분리하고, LLM 판단만으로 PASS를 만들지 않는 것**입니다.

## Repository map

```text
.
├── index.html
├── styles.css
├── app.js
├── architecture/
│   ├── system-overview.md
│   ├── agent-workflow.md
│   └── verification-boundary.md
├── decisions/
│   ├── why-human-in-the-loop.md
│   ├── why-evidence-based-verification.md
│   └── why-local-first.md
├── evidence/
│   ├── incident-example.json
│   ├── verification-result.json
│   └── sample-report.md
├── demo/
│   └── README.md
├── docs/
│   └── case-study.md
└── SANITIZATION.md
```

## What is intentionally not public

- private `src/`, `internal/` implementation
- production prompts / agent implementation
- planner and runner internals beyond public contracts
- production Docker/deployment manifests
- actual connector/MCP configuration
- secrets, tokens, hosts, usernames, private repository names
- company database schema, routes, tickets, issue numbers, customer data

## Public evidence, not public implementation

이 포트폴리오는 소스 전체를 공개하는 대신 다음을 검증 가능하게 보여주는 데 초점을 둡니다.

1. 시스템 경계와 데이터 흐름
2. Human-in-the-loop 설계 이유
3. Evidence 기반 검증 계약
4. `PASS / FAIL / PARTIAL` 의미
5. synthetic incident가 조사 → 검증 → 승인으로 진행되는 과정
6. 실제 private implementation과 공개 demo 사이의 sanitization 원칙

자세한 내용은 [`docs/case-study.md`](docs/case-study.md)와 [`architecture/system-overview.md`](architecture/system-overview.md)를 참고하세요.
