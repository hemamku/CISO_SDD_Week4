const layers = [
  { id: '01', icon: '⇥', name: 'Experience', description: 'Client surfaces & API gateway', title: 'Experience layer', copy: 'The governed front door for humans, services, and automation. Every request is authenticated before it enters the platform.', controls: ['OIDC authentication', 'Rate limiting', 'Request correlation IDs'], owner: 'Platform engineering' },
  { id: '02', icon: '◉', name: 'Guardrails', description: 'Policy, safety & identity', title: 'Guardrails layer', copy: 'A policy enforcement point that checks intent, sensitive data, and tool permissions before agentic work begins.', controls: ['Prompt injection detection', 'PII classification and redaction', 'Policy-as-code evaluation'], owner: 'Security engineering' },
  { id: '03', icon: '✣', name: 'Agentic logic', description: 'Orchestration & tool use', title: 'Agentic logic layer', copy: 'Specialized agents collaborate through explicit contracts. Plans are bounded, tool calls are scoped, and every decision is observable.', controls: ['Supervisor / worker pattern', 'Tool allowlists', 'Human approval checkpoints'], owner: 'AI platform team' },
  { id: '04', icon: '⊙', name: 'Vector RAG', description: 'Retrieval & knowledge', title: 'Vector RAG layer', copy: 'Grounding context is retrieved from approved knowledge sources and passed with provenance into the reasoning loop.', controls: ['Document-level ACLs', 'Hybrid retrieval', 'Citation and freshness checks'], owner: 'Data platform' },
  { id: '05', icon: '⌁', name: 'Telemetry', description: 'Tracing & evaluation', title: 'Telemetry layer', copy: 'A unified signal plane captures the full request journey, from token economics to evaluator scores and production drift.', controls: ['OpenTelemetry traces', 'Arize Phoenix evaluation', 'Immutable audit events'], owner: 'SRE / FinOps' }
];

const layerMap = document.querySelector('#layerMap');
layerMap.innerHTML = layers.map(layer => `<article class="layer-card" data-layer="${layer.id}"><span class="layer-number">${layer.id}</span><div class="layer-icon">${layer.icon}</div><h3>${layer.name}</h3><p>${layer.description}</p><span class="layer-rail"></span></article>`).join('');

const traceSteps = ['Client', 'API Gateway', 'Guardrails', 'Agentic Logic', 'Vector Store', 'Telemetry'];
const tracePath = document.querySelector('#tracePath');
tracePath.innerHTML = traceSteps.map((step, index) => `<div class="trace-step" data-step="${index}"><div class="trace-node">${String(index + 1).padStart(2, '0')}</div><strong>${step}</strong><small>${index === 0 ? 'request' : index === 5 ? 'recorded' : 'pending'}</small></div>`).join('');

const bars = document.querySelector('#bars');
bars.innerHTML = [44, 61, 48, 72, 57, 79, 68, 52, 63, 84, 75, 91, 70, 86, 78, 95, 82, 89].map(height => `<span class="bar" style="height:${height}%"></span>`).join('');

function showDetail(layer) {
  document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
  const detail = document.querySelector('#detailView');
  detail.classList.add('visible');
  document.querySelector('#detailKicker').textContent = `LAYER ${layer.id} / ${layer.name.toUpperCase()}`;
  document.querySelector('#detailContent').innerHTML = `<h2>${layer.title}</h2><p>${layer.copy}</p><div class="detail-cols"><div class="detail-block"><h3>Controls in scope</h3><ul>${layer.controls.map(control => `<li>${control}<span>ENFORCED</span></li>`).join('')}</ul></div><div class="detail-block"><h3>Accountability</h3><ul><li>Owning team<span>${layer.owner}</span></li><li>Evidence<span>SDD §${layer.id}.2</span></li><li>Runtime state<span style="color:var(--green)">HEALTHY</span></li></ul></div></div>`;
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === 'architecture'));
}

document.querySelectorAll('.layer-card').forEach(card => card.addEventListener('click', () => showDetail(layers.find(layer => layer.id === card.dataset.layer))));
document.querySelector('#backBtn').addEventListener('click', () => { document.querySelector('#detailView').classList.remove('visible'); document.querySelectorAll('.view').forEach(view => view.style.display = ''); document.querySelector('.nav-item[data-view="overview"]').classList.add('active'); });

function activateView(view) {
  document.querySelector('#detailView').classList.remove('visible');
  document.querySelectorAll('.view').forEach(panel => { panel.style.display = panel.dataset.viewPanel.split(' ').includes(view) ? '' : 'none'; });
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('[data-view-target]').forEach(button => button.addEventListener('click', () => activateView(button.dataset.viewTarget)));
document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => activateView(button.dataset.view)));

let traceTimer;
document.querySelector('#runTrace').addEventListener('click', () => {
  clearInterval(traceTimer);
  const button = document.querySelector('#runTrace');
  const status = document.querySelector('#traceStatus');
  const latency = document.querySelector('#traceLatency');
  button.disabled = true;
  button.innerHTML = '<span>◌</span> Running trace';
  status.className = 'trace-status running';
  status.innerHTML = '<span class="status-ring"></span>Request in flight';
  document.querySelectorAll('.trace-step').forEach(step => step.classList.remove('active', 'done'));
  let index = 0;
  traceTimer = setInterval(() => {
    document.querySelectorAll('.trace-step').forEach((step, stepIndex) => step.classList.toggle('done', stepIndex < index));
    const current = document.querySelector(`[data-step="${index}"]`);
    if (current) current.classList.add('active');
    index += 1;
    if (index > traceSteps.length) {
      clearInterval(traceTimer);
      document.querySelectorAll('.trace-step').forEach(step => { step.classList.remove('active'); step.classList.add('done'); });
      status.className = 'trace-status complete';
      status.innerHTML = '<span class="status-ring"></span>Trace complete';
      latency.textContent = '842 ms';
      button.disabled = false;
      button.innerHTML = '<span>↻</span> Run again';
    }
  }, 450);
});

document.querySelector('#exportBtn').addEventListener('click', () => {
  const button = document.querySelector('#exportBtn');
  button.innerHTML = 'SDD ready <span>✓</span>';
  button.style.borderColor = 'var(--green)';
  setTimeout(() => { button.innerHTML = 'Export SDD <span>↓</span>'; button.style.borderColor = ''; }, 1800);
});