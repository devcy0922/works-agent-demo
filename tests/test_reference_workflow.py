import sys

import pytest

from works_agent_demo.domain import ApprovalGate, Evidence, Verdict, aggregate_verdict
from works_agent_demo.runtime import VerificationCheck, Policy, run_workflow


def test_workflow_executes_a_real_local_command():
    _, evidence, verdict = run_workflow("pass")
    assert evidence[0].observed["exit_code"] == 0
    assert verdict is Verdict.PASS


@pytest.mark.parametrize(
    ("scenario", "expected"),
    [("fail", Verdict.FAIL), ("partial", Verdict.PARTIAL)],
)
def test_failure_precedence_is_preserved(scenario, expected):
    _, _, verdict = run_workflow(scenario)
    assert verdict is expected


def test_empty_evidence_cannot_be_pass():
    assert aggregate_verdict([]) is Verdict.PARTIAL


def test_approval_requires_pass():
    gate = ApprovalGate()
    with pytest.raises(PermissionError):
        gate.approve(Verdict.PARTIAL)
    gate.approve(Verdict.PASS)
    assert gate.approved


def test_policy_denies_destructive_commands():
    with pytest.raises(ValueError):
        Policy().validate(VerificationCheck("unsafe", ("rm", "-rf", "/")))
