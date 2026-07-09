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

function initDemoConsole() {
  const roleButtons = Array.from(document.querySelectorAll('[data-demo-role]'));
  const roleName = document.getElementById('demo-role-name');
  const roleSummary = document.getElementById('demo-role-summary');
  const roleFocus = document.getElementById('demo-role-focus');
  const roleLink = document.getElementById('demo-role-link');
  const thresholdInput = document.getElementById('demo-threshold');
  const thresholdValue = document.getElementById('demo-threshold-value');
  const thresholdMode = document.getElementById('demo-threshold-mode');
  const thresholdDesc = document.getElementById('demo-threshold-desc');
  const scenarioCards = Array.from(document.querySelectorAll('[data-demo-scenario]'));
  const scenarioTitle = document.getElementById('demo-scenario-title');
  const scenarioSummary = document.getElementById('demo-scenario-summary');
  const scenarioHint = document.getElementById('demo-scenario-hint');
  const scenarioLink = document.getElementById('demo-scenario-link');

  function applyRole(button) {
    roleButtons.forEach((item) => item.classList.toggle('active', item === button));
    if (roleName) roleName.textContent = button.dataset.roleName || '--';
    if (roleSummary) roleSummary.textContent = button.dataset.roleSummary || '--';
    if (roleFocus) roleFocus.textContent = button.dataset.roleFocus || '--';
    if (roleLink) {
      roleLink.textContent = button.dataset.roleCta || '进入对应页面';
      roleLink.href = button.dataset.roleHref || './Demo控制台（总入口）.html';

    }
  }

  function updateThreshold() {
    if (!thresholdInput) return;
    const threshold = Number(thresholdInput.value);
    if (thresholdValue) thresholdValue.textContent = threshold.toFixed(2);
    let mode = '平衡模式';
    let desc = '适合演示大多数路径：兼顾召回数量与展示稳定性。';
    if (threshold >= 0.86) {
      mode = '严格模式';
      desc = '更适合高风险规则验证，低分内容会更早被拦截。';
    } else if (threshold <= 0.68) {
      mode = '探索模式';
      desc = '适合展示更多候选结果，但需要更强的人工甄别。';
    }
    if (thresholdMode) thresholdMode.textContent = mode;
    if (thresholdDesc) thresholdDesc.textContent = desc;
  }

  function applyScenario(card) {
    scenarioCards.forEach((item) => item.classList.toggle('active', item === card));
    if (scenarioTitle) scenarioTitle.textContent = card.dataset.scenarioTitle || '--';
    if (scenarioSummary) scenarioSummary.textContent = card.dataset.scenarioSummary || '--';
    if (scenarioHint) scenarioHint.textContent = card.dataset.scenarioHint || '--';
    if (scenarioLink) scenarioLink.href = card.dataset.scenarioHref || './Demo控制台（总入口）.html';

  }

  roleButtons.forEach((button) => button.addEventListener('click', () => applyRole(button)));
  scenarioCards.forEach((card) => card.addEventListener('click', () => applyScenario(card)));

  if (thresholdInput) thresholdInput.addEventListener('input', updateThreshold);

  const shortcutConfirm = document.getElementById('demo-shortcut-confirm');
  if (shortcutConfirm) {
    shortcutConfirm.addEventListener('click', () => {
      document.querySelector('[data-modal="demo-shortcuts"]')?.classList.remove('active');
      showToast('已准备好本轮演示路径，可从控制台继续跳转体验');
    });
  }

  if (roleButtons[0]) applyRole(roleButtons[0]);
  if (scenarioCards[0]) applyScenario(scenarioCards[0]);
  updateThreshold();
}

function initAdminGovernance() {
  const rows = Array.from(document.querySelectorAll('[data-admin-row]'));
  const searchInput = document.getElementById('admin-search');
  const envButtons = Array.from(document.querySelectorAll('[data-governance-env]'));
  const envPanels = Array.from(document.querySelectorAll('[data-env-panel]'));
  const detailTitle = document.getElementById('admin-detail-title');
  const detailOwner = document.getElementById('admin-detail-owner');
  const detailScope = document.getElementById('admin-detail-scope');
  const detailStatus = document.getElementById('admin-detail-status');
  const detailSummary = document.getElementById('admin-detail-summary');
  const thresholdInput = document.getElementById('governance-threshold');
  const thresholdValue = document.getElementById('governance-threshold-value');
  const governanceMode = document.getElementById('governance-mode');
  const governanceImpact = document.getElementById('governance-impact');

  function selectRow(row) {
    rows.forEach((item) => item.classList.toggle('is-selected', item === row));
    if (detailTitle) detailTitle.textContent = row.dataset.title || '--';
    if (detailOwner) detailOwner.textContent = row.dataset.owner || '--';
    if (detailScope) detailScope.textContent = row.dataset.scope || '--';
    if (detailStatus) detailStatus.textContent = row.dataset.status || '--';
    if (detailSummary) detailSummary.textContent = row.dataset.summary || '--';
  }

  rows.forEach((row) => row.addEventListener('click', () => selectRow(row)));

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      rows.forEach((row) => {
        const match = !keyword || row.innerText.toLowerCase().includes(keyword);
        row.style.display = match ? '' : 'none';
      });
    });
  }

  envButtons.forEach((button) => {
    button.addEventListener('click', () => {
      envButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      envPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.envPanel === button.dataset.governanceEnv));
    });
  });

  function updateGovernanceThreshold() {
    if (!thresholdInput) return;
    const value = Number(thresholdInput.value);
    if (thresholdValue) thresholdValue.textContent = value.toFixed(2);
    if (governanceMode) {
      governanceMode.textContent = value >= 0.83 ? '严格过滤' : value <= 0.66 ? '宽松探索' : '平衡治理';
    }
    if (governanceImpact) {
      governanceImpact.textContent = value >= 0.83
        ? '生产环境会更强调规则类知识和最新版本，零结果率会上升但错误引用更少。'
        : value <= 0.66
          ? '更适合灰度联调和召回扩量，但需要日志与审计中心更密集观察。'
          : '适合作为大部分业务线的默认策略，兼顾召回与稳定性。';
    }
  }

  if (thresholdInput) thresholdInput.addEventListener('input', updateGovernanceThreshold);

  const createSpaceConfirm = document.getElementById('create-space-confirm');
  if (createSpaceConfirm) {
    createSpaceConfirm.addEventListener('click', () => {
      document.querySelector('[data-modal="create-space"]')?.classList.remove('active');
      showToast('已创建知识空间草稿，请继续配置权限与检索策略');
    });
  }

  if (rows[0]) selectRow(rows[0]);
  if (envButtons[0]) envButtons[0].classList.add('active');
  updateGovernanceThreshold();
}

function initRetrievalDebug() {
  const queryInput = document.getElementById('debug-query');
  const runButton = document.getElementById('run-debug');
  const resetButton = document.getElementById('reset-debug');
  const thresholdInput = document.getElementById('debug-threshold');
  const thresholdValue = document.getElementById('debug-threshold-value');
  const hitCountNodes = Array.from(document.querySelectorAll('[data-debug-hit-count]'));
  const queryEcho = document.getElementById('debug-query-echo');

  const queryEchoSecondary = document.getElementById('debug-query-echo-secondary');
  const preview = document.getElementById('debug-preview');
  const resultCards = Array.from(document.querySelectorAll('[data-debug-doc]'));
  const docTitle = document.getElementById('debug-doc-title');
  const docReason = document.getElementById('debug-doc-reason');
  const docCitation = document.getElementById('debug-doc-citation');
  const rerankSummary = document.getElementById('debug-rerank-summary');
  const failureButtons = Array.from(document.querySelectorAll('[data-debug-failure]'));
  const failurePanels = Array.from(document.querySelectorAll('[data-debug-failure-panel]'));

  function applyResult(card) {
    resultCards.forEach((item) => item.classList.toggle('active', item === card));
    if (docTitle) docTitle.textContent = card.dataset.title || '--';
    if (docReason) docReason.textContent = card.dataset.reason || '--';
    if (docCitation) docCitation.textContent = card.dataset.citation || '--';
  }

  function updateThreshold() {
    if (!thresholdInput) return;
    const threshold = Number(thresholdInput.value);
    if (thresholdValue) thresholdValue.textContent = threshold.toFixed(2);
    let count = 0;
    resultCards.forEach((card) => {
      const active = Number(card.dataset.score || 0) >= threshold;
      card.classList.toggle('active', active);
      if (active) count += 1;
    });
    hitCountNodes.forEach((node) => {
      node.textContent = String(count);
    });
    if (preview) {

      preview.innerHTML = count >= 2
        ? '<strong>Query 调试结论</strong><div>召回和重排结果稳定，适合展示带引用的标准答案。</div><blockquote>建议保留 Top 2 候选，并在回答区展示版本与更新时间。</blockquote>'
        : '<strong>Query 调试结论</strong><div>当前阈值过高，候选证据不足，建议补别名问法或放宽召回门槛。</div><blockquote>建议切回检索调试，查看零结果原因和召回字段覆盖情况。</blockquote>';
    }
    if (rerankSummary) {
      rerankSummary.textContent = count >= 2
        ? '当前重排后 Top 文档得分分布健康，FAQ 与规则文档形成互补。'
        : '当前仅保留了少量高分文档，建议回查 Query 改写与别名召回配置。';
    }
  }

  function runDebug(showTip = true) {
    const query = (queryInput?.value || '退款多久到账').trim() || '退款多久到账';
    if (queryEcho) queryEcho.textContent = query;
    if (queryEchoSecondary) queryEchoSecondary.textContent = query;
    updateThreshold();
    if (showTip) showToast('已完成一次 Query 调试，并刷新召回 / 重排 / 引用链路');
  }

  resultCards.forEach((card) => card.addEventListener('click', () => applyResult(card)));
  if (thresholdInput) thresholdInput.addEventListener('input', updateThreshold);
  if (runButton) runButton.addEventListener('click', () => runDebug(true));
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (queryInput) queryInput.value = '退款多久到账';
      if (thresholdInput) thresholdInput.value = '0.72';
      runDebug(false);
      showToast('已重置为默认调试场景');
    });
  }

  failureButtons.forEach((button) => {
    button.addEventListener('click', () => {
      failureButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      failurePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.debugFailurePanel === button.dataset.debugFailure));
    });
  });

  const runEval = document.getElementById('run-eval');
  if (runEval) runEval.addEventListener('click', () => showToast('评测任务已启动，预计 3 分钟后更新结果'));

  if (resultCards[0]) applyResult(resultCards[0]);
  runDebug(false);
}

function initConsumerPortal() {
  const items = Array.from(document.querySelectorAll('[data-consume-item]'));
  const searchInput = document.getElementById('consume-search');
  const searchButton = document.getElementById('consume-search-btn');
  const categoryButtons = Array.from(document.querySelectorAll('[data-consume-category]'));
  const detailTitle = document.getElementById('consume-detail-title');
  const detailCategory = document.getElementById('consume-detail-category');
  const detailSource = document.getElementById('consume-detail-source');
  const detailUpdated = document.getElementById('consume-detail-updated');
  const detailSummary = document.getElementById('consume-detail-summary');
  const favoriteButton = document.getElementById('consume-favorite-btn');
  const favoriteCount = document.getElementById('consume-fav-count');
  const favoriteList = document.getElementById('favorite-list');
  const recentList = document.getElementById('consume-recent-list');
  const emptyNote = document.getElementById('consume-empty-note');
  const topicButtons = Array.from(document.querySelectorAll('[data-topic-fill]'));

  let currentCategory = 'all';
  let currentItem = null;
  const favoriteIds = new Set(['refund', 'invoice']);
  const recentIds = ['account', 'refund'];

  function getItemById(id) {
    return items.find((item) => item.dataset.id === id);
  }

  function renderFavorites() {
    if (!favoriteList) return;
    const entries = Array.from(favoriteIds).map(getItemById).filter(Boolean);
    favoriteList.innerHTML = entries.map((item) => `
      <div class="activity-item">
        <div>
          <strong>${item.dataset.title}</strong>
          <div class="muted">${item.dataset.source}</div>
        </div>
        <span class="status success">已收藏</span>
      </div>
    `).join('');
    if (favoriteCount) favoriteCount.textContent = String(entries.length);
  }

  function renderRecent() {
    if (!recentList) return;
    const entries = recentIds.map(getItemById).filter(Boolean).slice(0, 4);
    recentList.innerHTML = entries.map((item, index) => `
      <div class="history-item">
        <div>
          <strong>${item.dataset.title}</strong>
          <div class="muted">${item.dataset.updated}</div>
        </div>
        <span class="badge info">最近浏览 ${index + 1}</span>
      </div>
    `).join('');
  }

  function updateFavoriteButton() {
    if (!favoriteButton || !currentItem) return;
    const active = favoriteIds.has(currentItem.dataset.id || '');
    favoriteButton.textContent = active ? '取消收藏' : '加入收藏';
  }

  function selectItem(item) {
    currentItem = item;
    items.forEach((entry) => entry.classList.toggle('active', entry === item));
    if (detailTitle) detailTitle.textContent = item.dataset.title || '--';
    if (detailCategory) detailCategory.textContent = item.dataset.category || '--';
    if (detailSource) detailSource.textContent = item.dataset.source || '--';
    if (detailUpdated) detailUpdated.textContent = item.dataset.updated || '--';
    if (detailSummary) detailSummary.textContent = item.dataset.summary || '--';
    const id = item.dataset.id || '';
    const exists = recentIds.indexOf(id);
    if (exists !== -1) recentIds.splice(exists, 1);
    recentIds.unshift(id);
    renderRecent();
    updateFavoriteButton();
  }

  function filterItems() {
    const keyword = (searchInput?.value || '').trim().toLowerCase();
    const visible = [];
    items.forEach((item) => {
      const text = item.innerText.toLowerCase();
      const categoryMatch = currentCategory === 'all' || item.dataset.categoryKey === currentCategory;
      const keywordMatch = !keyword || text.includes(keyword);
      const show = categoryMatch && keywordMatch;
      item.style.display = show ? '' : 'none';
      if (show) visible.push(item);
    });
    if (emptyNote) emptyNote.classList.toggle('show', visible.length === 0);
    if (visible.length && (!currentItem || currentItem.style.display === 'none')) {
      selectItem(visible[0]);
    }
  }

  items.forEach((item) => item.addEventListener('click', () => selectItem(item)));

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      categoryButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.dataset.consumeCategory || 'all';
      filterItems();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterItems);
  if (searchButton) searchButton.addEventListener('click', () => {
    filterItems();
    showToast('已刷新搜索结果与知识详情预览');
  });

  if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {
      if (!currentItem) return;
      const id = currentItem.dataset.id || '';
      if (favoriteIds.has(id)) {
        favoriteIds.delete(id);
        showToast('已取消收藏');
      } else {
        favoriteIds.add(id);
        showToast('已加入收藏');
      }
      renderFavorites();
      updateFavoriteButton();
    });
  }

  topicButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (searchInput) searchInput.value = button.dataset.topicFill || '';
      currentCategory = 'all';
      categoryButtons.forEach((item) => item.classList.toggle('active', item.dataset.consumeCategory === 'all'));
      filterItems();
      showToast('已切换到对应专题搜索场景');
    });
  });

  const submitFeedback = document.getElementById('submit-feedback');
  if (submitFeedback) {
    submitFeedback.addEventListener('click', () => {
      document.querySelector('[data-modal="consumer-feedback"]')?.classList.remove('active');
      showToast('反馈已提交，已同步到运营侧反馈处理中心');
    });
  }

  renderFavorites();
  renderRecent();
  if (items[0]) selectItem(items[0]);
  filterItems();
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModalAndDrawer();
  initFilterPills();
  initCopyButtons();
  if (document.body.dataset.page === 'ops-workbench') initOpsWorkbench();
  if (document.body.dataset.page === 'agent-integration') initAgentIntegration();
  if (document.body.dataset.page === 'demo-console') initDemoConsole();
  if (document.body.dataset.page === 'admin-governance') initAdminGovernance();
  if (document.body.dataset.page === 'retrieval-debug') initRetrievalDebug();
  if (document.body.dataset.page === 'consumer-portal') initConsumerPortal();
});
