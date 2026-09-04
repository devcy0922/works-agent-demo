from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class Verdict(str, Enum):
    PASS = "PASS"
    PARTIAL = "PARTIAL"
    FAIL = "FAIL"


@dataclass(frozen=True)
class Evidence:
    check_id: str
    check_type: str
    result: Verdict
    observed: dict[str, Any] = field(default_factory=dict)
    reason: str = ""


@dataclass(frozen=True)
class Proposal:
    case_id: str
    summary: str
    mutation: bool = False


@dataclass
class Case:
    case_id: str
    event: dict[str, Any]
    evidence: list[dict[str, Any]] = field(default_factory=list)
    proposal: Proposal | None = None


def aggregate_verdict(evidence: list[Evidence]) -> Verdict:
    """Fail closed: missing evidence is PARTIAL; FAIL always wins."""
    if not evidence:
        return Verdict.PARTIAL
    results = {item.result for item in evidence}
    if Verdict.FAIL in results:
        return Verdict.FAIL
    if Verdict.PARTIAL in results:
        return Verdict.PARTIAL
    return Verdict.PASS


class ApprovalGate:
    """A deliberately small approval boundary with no external side effects."""

    def __init__(self) -> None:
        self.approved = False

    def approve(self, verdict: Verdict) -> None:
        if verdict is not Verdict.PASS:
            raise PermissionError("approval requires PASS evidence")
        self.approved = True
