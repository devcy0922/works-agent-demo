from __future__ import annotations

import subprocess
import sys
from dataclasses import dataclass
from typing import Callable

from .domain import Case, Evidence, Proposal, Verdict, aggregate_verdict


@dataclass(frozen=True)
class VerificationCheck:
    check_id: str
    command: tuple[str, ...]
    check_type: str = "command"


class SyntheticCollector:
    def collect(self, event: dict[str, object]) -> list[dict[str, object]]:
        return [
            {"source": "synthetic-log", "signal": event.get("signal", "unknown")},
            {"source": "synthetic-record", "currency": event.get("currency")},
        ]


class Investigator:
    def analyze(self, case: Case) -> Proposal:
        return Proposal(
            case_id=case.case_id,
            summary="Add a null guard and a focused regression test.",
            mutation=False,
        )


class Policy:
    def validate(self, check: VerificationCheck) -> None:
        denied = {"rm", "sudo", "mkfs", "dd"}
        if not check.command or check.command[0] in denied:
            raise ValueError(f"command is not allowed: {check.command!r}")


class CommandRunner:
    def run(self, check: VerificationCheck) -> Evidence:
        try:
            completed = subprocess.run(
                check.command,
                check=False,
                capture_output=True,
                text=True,
                timeout=3,
            )
        except subprocess.TimeoutExpired:
            return Evidence(check.check_id, check.check_type, Verdict.PARTIAL, reason="timeout")
        result = Verdict.PASS if completed.returncode == 0 else Verdict.FAIL
        return Evidence(
            check.check_id,
            check.check_type,
            result,
            observed={"exit_code": completed.returncode, "stdout": completed.stdout.strip()},
            reason=completed.stderr.strip(),
        )


def run_workflow(
    scenario: str = "pass",
    *,
    runner: CommandRunner | None = None,
    on_step: Callable[[str], None] | None = None,
) -> tuple[Case, list[Evidence], Verdict]:
    """Run the public workflow with real local command execution."""
    if scenario not in {"pass", "partial", "fail"}:
        raise ValueError("scenario must be pass, partial, or fail")
    emit = on_step or (lambda _: None)
    case = Case("demo-incident-001", {"signal": "currency-null", "currency": None})
    emit("collect")
    case.evidence = SyntheticCollector().collect(case.event)
    emit("investigate")
    case.proposal = Investigator().analyze(case)
    emit("verify")

    if scenario == "pass":
        code = "print('focused regression passed')"
    elif scenario == "fail":
        code = "raise SystemExit('currency=null regression reproduced')"
    else:
        code = "import time; time.sleep(4)"
    checks = [VerificationCheck("focused-regression", (sys.executable, "-c", code))]
    policy = Policy()
    executor = runner or CommandRunner()
    evidence: list[Evidence] = []
    for check in checks:
        policy.validate(check)
        evidence.append(executor.run(check))
    verdict = aggregate_verdict(evidence)
    emit("evidence")
    return case, evidence, verdict
