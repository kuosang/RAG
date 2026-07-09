function initTabs(scope = document) {
  scope.querySelectorAll('[data-tab-group]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab-target]');
    if (!buttons.length) return;
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.tabTarget;
        const root = button.closest('[data-tab-root]') || document;
        buttons.forEach((item) => item.classList.toggle('active', item === button));
        root.querySelectorAll('[data-tab-panel]').forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.tabPanel === target);
        });
      });
    });
  });
}

function initModalAndDrawer() {
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(`[data-modal="${btn.dataset.openModal}"]`);
      if (modal) modal.classList.add('active');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('.modal-overlay')?.classList.remove('active'));
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.classList.remove('active');
    });
  });

  document.querySelectorAll('[data-open-drawer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const drawer = document.querySelector(`[data-drawer="${btn.dataset.openDrawer}"]`);
      if (!drawer) return;
      Object.entries(btn.dataset).forEach(([key, value]) => {
        if (['openDrawer'].includes(key)) return;
        const target = drawer.querySelector(`[data-fill="${key}"]`);
        if (target) target.textContent = value;
      });
      drawer.classList.add('active');
    });
  });

  document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('.drawer-overlay')?.classList.remove('active'));
  });

  document.querySelectorAll('.drawer-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.classList.remove('active');
    });
  });
}

function initFilterPills() {
  document.querySelectorAll('[data-pill-group]').forEach((group) => {
    const pills = group.querySelectorAll('[data-pill]');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        if (group.dataset.single !== 'false') {
          pills.forEach((item) => item.classList.remove('active'));
        }
        pill.classList.add('active');
      });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('floating-note');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy || '';
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        }
        showToast(button.dataset.copySuccess || '已复制');
      } catch (error) {
        showToast('复制失败，请手动复制');
      }
    });
  });
}

function initOpsWorkbench() {
  const rows = Array.from(document.querySelectorAll('[data-knowledge-row]'));
  const detailTitle = document.getElementById('knowledge-detail-title');
  const detailScore = document.getElementById('knowledge-detail-score');
  const detailStatus = document.getElementById('knowledge-detail-status');
  const detailOwner = document.getElementById('knowledge-detail-owner');
  const detailSummary = document.getElementById('knowledge-detail-summary');
  const searchInput = document.getElementById('knowledge-search');
  const filterButtons = document.querySelectorAll('[data-status-filter]');
  const stageButtons = document.querySelectorAll('[data-stage-view]');
  const stagePanels = document.querySelectorAll('[data-stage-panel]');

  function applySelection(row) {
    rows.forEach((item) => item.classList.toggle('is-selected', item === row));
    if (detailTitle) detailTitle.textContent = row.dataset.title || '--';
    if (detailScore) detailScore.textContent = row.dataset.score || '--';
    if (detailStatus) detailStatus.textContent = row.dataset.status || '--';
    if (detailOwner) detailOwner.textContent = row.dataset.owner || '--';
    if (detailSummary) detailSummary.textContent = row.dataset.summary || '--';
  }

  rows.forEach((row) => {
    row.addEventListener('click', () => applySelection(row));
  });

  let currentStatus = 'all';
  function filterRows() {
    const keyword = (searchInput?.value || '').trim().toLowerCase();
    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      const statusMatch = currentStatus === 'all' || row.dataset.statusKey === currentStatus;
      const keywordMatch = !keyword || text.includes(keyword);
      row.style.display = statusMatch && keywordMatch ? '' : 'none';
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentStatus = button.dataset.statusFilter || 'all';
      filterRows();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterRows);

  stageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      stageButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      stagePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.stagePanel === button.dataset.stageView));
    });
  });

  const simulateCreate = document.getElementById('simulate-create');
  if (simulateCreate) {
    simulateCreate.addEventListener('click', () => {
      document.querySelector('[data-modal="create-knowledge"]')?.classList.add('active');
    });
  }

  const createConfirm = document.getElementById('create-knowledge-confirm');
  if (createConfirm) {
    createConfirm.addEventListener('click', () => {
      document.querySelector('[data-modal="create-knowledge"]')?.classList.remove('active');
      showToast('已创建知识草稿，并进入待补充字段状态');
    });
  }

  const submitReview = document.getElementById('submit-review');
  if (submitReview) {
    submitReview.addEventListener('click', () => {
      showToast('已提交审核，审核中心待处理 +1');
      const badge = document.getElementById('pending-review-count');
      if (badge) badge.textContent = '19';
    });
  }

  const importStart = document.getElementById('start-import');
  if (importStart) {
    importStart.addEventListener('click', () => showToast('已加入导入队列，预计 2 分钟后完成解析'));
  }

  const publishButton = document.getElementById('publish-version');
  if (publishButton) {
    publishButton.addEventListener('click', () => showToast('版本已发布，维护任务将自动重算引用命中'));
  }

  if (rows[0]) applySelection(rows[0]);
  filterRows();
}

function initAgentIntegration() {
  const agentCards = Array.from(document.querySelectorAll('[data-agent-card]'));
  const agentName = document.getElementById('agent-name');
  const agentOwner = document.getElementById('agent-owner');
  const agentSpace = document.getElementById('agent-space');
  const agentStatus = document.getElementById('agent-status');
  const agentPolicy = document.getElementById('agent-policy');
  const agentDesc = document.getElementById('agent-desc');
  const bindSpace = document.getElementById('binding-space');
  const previewAnswer = document.getElementById('preview-answer');
  const scoreRows = Array.from(document.querySelectorAll('[data-hit-score]'));
  const thresholdInput = document.getElementById('agent-threshold');
  const thresholdValue = document.getElementById('agent-threshold-value');
  const hitCount = document.getElementById('agent-hit-count');
  const agentSearch = document.getElementById('agent-search');

  function selectAgent(card) {
    agentCards.forEach((item) => item.classList.toggle('active', item === card));
    if (agentName) agentName.textContent = card.dataset.name || '--';
    if (agentOwner) agentOwner.textContent = card.dataset.owner || '--';
    if (agentSpace) agentSpace.textContent = card.dataset.space || '--';
    if (bindSpace) bindSpace.textContent = card.dataset.space || '--';
    if (agentPolicy) agentPolicy.textContent = card.dataset.policy || '--';
    if (agentDesc) agentDesc.textContent = card.dataset.desc || '--';
    if (agentStatus) {
      agentStatus.textContent = card.dataset.status || '--';
      agentStatus.className = `status ${card.dataset.statusClass || 'info'}`;
    }
  }

  agentCards.forEach((card) => card.addEventListener('click', () => selectAgent(card)));

  function updateThreshold() {
    if (!thresholdInput) return;
    const threshold = Number(thresholdInput.value);
    if (thresholdValue) thresholdValue.textContent = threshold.toFixed(2);
    let count = 0;
    scoreRows.forEach((row) => {
      const score = Number(row.dataset.hitScore || 0);
      const active = score >= threshold;
      row.classList.toggle('active', active);
      if (active) count += 1;
    });
    if (hitCount) hitCount.textContent = String(count);
    if (previewAnswer) {
      previewAnswer.innerHTML = count >= 2
        ? '<strong>生成回答（引用充足）</strong><div>已命中高可信知识，建议返回标准答案 + 版本信息 + 处理步骤。</div><blockquote>根据《账号重置流程 v4》和《身份验证策略》：请先校验 MFA，再引导用户进行密码重置。</blockquote>'
        : '<strong>生成回答（触发兜底）</strong><div>命中证据不足，将提示 Agent 缩短回答，并引导人工确认。</div><blockquote>当前检索结果可信度不足，建议转人工或补充更多上下文后重试。</blockquote>';
    }
  }

  if (thresholdInput) thresholdInput.addEventListener('input', updateThreshold);

  if (agentSearch) {
    agentSearch.addEventListener('input', () => {
      const keyword = agentSearch.value.trim().toLowerCase();
      agentCards.forEach((card) => {
        const match = !keyword || card.innerText.toLowerCase().includes(keyword);
        card.style.display = match ? '' : 'none';
      });
    });
  }

  const previewRun = document.getElementById('preview-run');
  if (previewRun) {
    previewRun.addEventListener('click', () => {
      updateThreshold();
      showToast('已完成一次联调模拟，并刷新引用展示结果');
    });
  }

  document.querySelectorAll('[data-publish-config]').forEach((button) => {
    button.addEventListener('click', () => showToast('Agent 配置已发布到灰度环境'));
  });

  const rotateKey = document.getElementById('rotate-key');
  if (rotateKey) {
    rotateKey.addEventListener('click', () => {
      const key = document.getElementById('api-key-value');
      if (key) key.textContent = 'kb_agent_2026_03_19_r9x***';
      showToast('API Key 已重置，请同步更新调用方密钥');
    });
  }

  if (agentCards[0]) selectAgent(agentCards[0]);
  updateThreshold();
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModalAndDrawer();
  initFilterPills();
  initCopyButtons();
  if (document.body.dataset.page === 'ops-workbench') initOpsWorkbench();
  if (document.body.dataset.page === 'agent-integration') initAgentIntegration();
});
