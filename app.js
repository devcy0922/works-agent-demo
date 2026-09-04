const scenarios = {
  pass: {
    verdict: 'PASS',
    summary: 'All required verification checks produced passing execution evidence.',
    checks: [
      { type: 'HTTP', name: 'GET /health', result: 'PASS', detail: 'expected=200 · actual=200 · 84ms' },
      { type: 'CMD', name: 'focused regression test', result: 'PASS', detail: 'exit_code=0 · 18 tests passed · synthetic fixture' },
      { type: 'UI', name: 'checkout smoke flow', result: 'PASS', detail: '3 assertions observed · snapshot evidence recorded' }
    ]
  },
  partial: {
    verdict: 'PARTIAL',
    summary: 'The change passed executable API and command checks, but browser evidence could not be completed.',
    checks: [
      { type: 'HTTP', name: 'GET /health', result: 'PASS', detail: 'expected=200 · actual=200 · 91ms' },
      { type: 'CMD', name: 'focused regression test', result: 'PASS', detail: 'exit_code=0 · 18 tests passed · synthetic fixture' },
      { type: 'UI', name: 'checkout smoke flow', result: 'PARTIAL', detail: 'browser dependency unavailable · no PASS inferred' }
    ]
  },
  fail: {
    verdict: 'FAIL',
    summary: 'A focused regression check reproduced the product failure. Later passing checks cannot override FAIL.',
    checks: [
      { type: 'HTTP', name: 'GET /health', result: 'PASS', detail: 'expected=200 · actual=200 · 79ms' },
      { type: 'CMD', name: 'focused regression test', result: 'FAIL', detail: 'exit_code=1 · currency=null path reproduced' },
      { type: 'UI', name: 'checkout smoke flow', result: 'PASS', detail: 'page rendered, but aggregate verdict remains FAIL' }
    ]
  }
};

const investigationSteps = [
  {
    title: 'Normalize work event',
    description: 'Converted the alert webhook into a case envelope and bound the read-only demo profile.',
    tags: ['trigger:webhook', 'policy:readonly']
  },
  {
    title: 'Collect operational evidence',
    description: 'Read synthetic application logs, a read-only order record and the latest example repository change.',
    tags: ['logs', 'db:readonly', 'git']
  },
  {
    title: 'Analyze bounded context',
    description: 'Correlated the first latency spike with requests where the optional currency field was missing.',
    tags: ['bounded-worker', 'provenance']
  },
  {
    title: 'Propose action',
    description: 'Prepared a null guard and focused regression-test proposal. No repository write has occurred.',
    tags: ['proposal', 'no-mutation']
  },
  {
    title: 'Hand off to verification',
    description: 'Transferred the proposed change boundary to PinchQ for inspect → plan → runner execution.',
    tags: ['pinchq', 'typed-plan']
  },
  {
    title: 'Record evidence verdict',
    description: 'PinchQ returned observed check evidence. Works can now expose the human approval boundary.',
    tags: ['evidence', 'human-gate']
  }
];

let selectedScenario = 'pass';
let running = false;
let approved = false;
let timers = [];

const scenarioButtons = [...document.querySelectorAll('.scenario-button')];
const runButton = document.getElementById('run-demo');
const resetButton = document.getElementById('reset-demo');
const timeline = document.getElementById('timeline');
const runState = document.getElementById('run-state');
const checks = document.getElementById('checks');
const verdict = document.getElementById('verdict');
const approveButton = document.getElementById('approve-action');
const approvalStatus = document.getElementById('approval-status');
const approvalHelp = document.getElementById('approval-help');

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function schedule(fn, delay) {
  const timer = setTimeout(fn, delay);
  timers.push(timer);
}

function selectScenario(name) {
  if (running || !scenarios[name]) return;
  selectedScenario = name;
  scenarioButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.scenario === name);
  });
  resetVisuals();
}

function resetVisuals() {
  clearTimers();
  running = false;
  approved = false;
  runButton.disabled = false;
  scenarioButtons.forEach(button => { button.disabled = false; });

  runState.textContent = 'Idle';
  runState.className = 'run-state idle';
  verdict.textContent = 'PENDING';
  verdict.className = 'verdict pending';

  timeline.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">→</div>
      <strong>Ready to run</strong>
      <span>Choose a scenario and start the deterministic workflow.</span>
    </div>`;

  checks.innerHTML = `
    <div class="check-row placeholder"><span>HTTP</span><b>/health</b><em>waiting</em></div>
    <div class="check-row placeholder"><span>CMD</span><b>focused regression test</b><em>waiting</em></div>
    <div class="check-row placeholder"><span>UI</span><b>checkout smoke flow</b><em>waiting</em></div>`;

  approveButton.disabled = true;
  approveButton.textContent = 'Approve proposed action';
  approveButton.classList.remove('approved');
  approvalStatus.textContent = 'Waiting for verification';
  approvalHelp.textContent = 'Approval is enabled only after a PASS verdict in this public demo.';
}

function renderTimelineStep(step, index, status = 'active') {
  const existing = [...timeline.querySelectorAll('.timeline-item')];
  existing.forEach(item => item.classList.remove('active'));
  existing.forEach(item => item.classList.add('complete'));

  const item = document.createElement('article');
  item.className = `timeline-item ${status}`;
  const timestamp = `T+${String(index * 4 + 1).padStart(2, '0')}s`;
  item.innerHTML = `
    <div class="timeline-index">${String(index + 1).padStart(2, '0')}</div>
    <div class="timeline-content">
      <div class="timeline-topline">
        <b>${step.title}</b>
        <time>${timestamp}</time>
      </div>
      <p>${step.description}</p>
      <div class="timeline-tags">${step.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    </div>`;
  timeline.appendChild(item);
}

function renderChecks(scenario) {
  checks.innerHTML = '';
  scenario.checks.forEach((check, index) => {
    schedule(() => {
      const row = document.createElement('div');
      const resultClass = check.result.toLowerCase();
      row.className = `check-row ${resultClass}-row`;
      row.innerHTML = `
        <span>${check.type}</span>
        <b>${check.name}</b>
        <em>${check.result}</em>
        <div class="check-detail">${check.detail}</div>`;
      checks.appendChild(row);
    }, index * 180);
  });
}

function finishScenario() {
  const scenario = scenarios[selectedScenario];
  running = false;
  runButton.disabled = false;
  scenarioButtons.forEach(button => { button.disabled = false; });
  runState.textContent = 'Evidence ready';
  runState.className = 'run-state done';

  verdict.textContent = scenario.verdict;
  verdict.className = `verdict ${scenario.verdict.toLowerCase()}`;

  if (scenario.verdict === 'PASS') {
    approvalStatus.textContent = 'Evidence complete';
    approveButton.disabled = false;
    approvalHelp.textContent = 'The operator can now approve the proposed action. The demo still performs no external write.';
  } else if (scenario.verdict === 'PARTIAL') {
    approvalStatus.textContent = 'More evidence required';
    approveButton.disabled = true;
    approvalHelp.textContent = 'PARTIAL preserves uncertainty. Missing browser evidence must be resolved or explicitly reviewed.';
  } else {
    approvalStatus.textContent = 'Action blocked';
    approveButton.disabled = true;
    approvalHelp.textContent = 'FAIL reproduced a regression. The proposal must be reworked before approval.';
  }
}

function runScenario() {
  if (running) return;
  resetVisuals();
  running = true;
  runButton.disabled = true;
  scenarioButtons.forEach(button => { button.disabled = true; });
  runState.textContent = 'Running';
  runState.className = 'run-state running';
  timeline.innerHTML = '';

  investigationSteps.forEach((step, index) => {
    schedule(() => {
      renderTimelineStep(step, index);
      if (index === 4) renderChecks(scenarios[selectedScenario]);
      if (index === investigationSteps.length - 1) {
        schedule(finishScenario, 680);
      }
    }, index * 420);
  });
}

function approveAction() {
  if (approveButton.disabled || scenarios[selectedScenario].verdict !== 'PASS' || approved) return;
  approved = true;
  approveButton.textContent = 'Approved · demo complete';
  approveButton.classList.add('approved');
  approveButton.disabled = true;
  approvalStatus.textContent = 'Human approved';
  approvalHelp.textContent = 'Public demo stops here. No repository, database or external system was changed.';
}

scenarioButtons.forEach(button => {
  button.addEventListener('click', () => selectScenario(button.dataset.scenario));
});
runButton.addEventListener('click', runScenario);
resetButton.addEventListener('click', resetVisuals);
approveButton.addEventListener('click', approveAction);

resetVisuals();
