/* ============================================
   registry.js — 工具注册与管理系统
   ============================================ */
const ToolManager = {
  tools: [],
  categories: {},

  register(tool) {
    this.tools.push(tool);
    if (!this.categories[tool.category]) {
      this.categories[tool.category] = [];
    }
    this.categories[tool.category].push(tool);
  },

  init() {
    this.renderCategories();
    this.bindSearch();
  },

  renderCategories() {
    const container = document.getElementById('tools-categories');
    if (!container) return;

    const categoryNames = {
      'encoding': '编解码',
      'format': '格式化',
      'generate': '生成器',
      'text': '文本处理',
      'dev': '开发工具',
      'other': '其他'
    };

    container.innerHTML = Object.entries(this.categories).map(([cat, tools]) => `
      <div class="tools-category" data-category="${cat}">
        <div class="category-header">${categoryNames[cat] || cat}</div>
        <div class="tools-grid">
          ${tools.map(t => `
            <div class="tool-card" data-tool="${t.id}" onclick="ToolManager.openTool('${t.id}')">
              <div class="tool-card-icon">${t.icon}</div>
              <div class="tool-card-info">
                <div class="tool-card-name">${t.name}</div>
                <div class="tool-card-desc">${t.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  openTool(id) {
    const tool = this.tools.find(t => t.id === id);
    if (!tool) return;

    const categories = document.getElementById('tools-categories');
    const workspace = document.getElementById('tools-workspace');
    const title = document.getElementById('tool-title');
    const content = document.getElementById('tool-content');

    if (categories) categories.style.display = 'none';
    if (workspace) workspace.style.display = 'block';
    if (title) title.textContent = `${tool.icon} ${tool.name}`;
    if (content) {
      content.innerHTML = '';
      tool.render(content);
    }
  },

  closeTool() {
    const categories = document.getElementById('tools-categories');
    const workspace = document.getElementById('tools-workspace');
    if (categories) categories.style.display = '';
    if (workspace) workspace.style.display = 'none';
  },

  bindSearch() {
    const search = document.getElementById('tools-search');
    if (!search) return;
    search.addEventListener('input', debounce(() => {
      const query = search.value.toLowerCase().trim();
      document.querySelectorAll('.tool-card').forEach(card => {
        const name = card.querySelector('.tool-card-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.tool-card-desc')?.textContent.toLowerCase() || '';
        card.style.display = (!query || name.includes(query) || desc.includes(query)) ? '' : 'none';
      });
    }, 200));
  }
};
