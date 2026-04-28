/* ============================================
   shortcuts.js — 快捷入口组件
   ============================================ */
const ShortcutsWidget = {
  defaultShortcuts: [
    { name: '工具库', icon: '🔧', action: () => navigateTo('tools') },
    { name: '大模型', icon: '🤖', action: () => navigateTo('llm') },
    { name: '文件库', icon: '📁', action: () => navigateTo('files') },
    { name: '设置', icon: '⚙️', action: () => navigateTo('settings') },
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com' },
    { name: 'Google', icon: '🔍', url: 'https://google.com' },
  ],

  init() {
    this.render();
  },

  getShortcuts() {
    return Storage.get('shortcuts', this.defaultShortcuts);
  },

  render() {
    const grid = document.getElementById('shortcuts-grid');
    if (!grid) return;
    const shortcuts = this.getShortcuts();

    grid.innerHTML = shortcuts.map((s, i) => `
      <a class="shortcut-item" ${s.url ? `href="${s.url}" target="_blank"` : ''} 
         data-index="${i}" title="${s.name}">
        <div class="shortcut-icon">${s.icon}</div>
        <span class="shortcut-name">${s.name}</span>
      </a>
    `).join('');

    // 绑定内部导航
    grid.querySelectorAll('.shortcut-item:not([href])').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index);
        const sc = shortcuts[idx];
        if (sc.action) sc.action();
        else if (sc.page) navigateTo(sc.page);
      });
    });
  },

  edit() {
    const shortcuts = this.getShortcuts();
    const html = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <p style="font-size:12px;color:var(--text-muted);">每行一个，格式：图标 名称 URL（可选）</p>
        <textarea id="shortcuts-edit" class="tool-textarea" style="min-height:200px;">${
          shortcuts.map(s => `${s.icon} ${s.name}${s.url ? ' ' + s.url : ''}`).join('\n')
        }</textarea>
        <div class="tool-actions">
          <button class="btn btn-primary" onclick="ShortcutsWidget.saveEdit()">保存</button>
          <button class="btn" onclick="Modal.close('modal-shortcuts')">取消</button>
        </div>
      </div>
    `;

    // 复用modal或创建临时modal
    let modal = document.getElementById('modal-shortcuts');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-shortcuts';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-overlay" onclick="Modal.close('modal-shortcuts')"></div>
        <div class="modal-content">
          <div class="modal-header"><h3>编辑快捷入口</h3><button class="modal-close" onclick="Modal.close('modal-shortcuts')">×</button></div>
          <div class="modal-body" id="shortcuts-edit-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    document.getElementById('shortcuts-edit-body').innerHTML = html;
    Modal.show('modal-shortcuts');
  },

  saveEdit() {
    const textarea = document.getElementById('shortcuts-edit');
    if (!textarea) return;

    const lines = textarea.value.trim().split('\n').filter(Boolean);
    const shortcuts = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const icon = parts[0] || '🔗';
      const name = parts[1] || '链接';
      const url = parts[2] || '';
      return { icon, name, url };
    });

    Storage.set('shortcuts', shortcuts);
    this.render();
    Modal.close('modal-shortcuts');
    Toast.success('快捷入口已更新');
  }
};
