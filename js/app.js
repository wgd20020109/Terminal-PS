/* ============================================
   app.js — 应用入口，路由，初始化
   ============================================ */

// 全局导航函数
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (pageEl) pageEl.classList.add('active');
  if (navEl) navEl.classList.add('active');
}

// 侧边栏折叠
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !toggle) return;

  // 恢复状态
  if (Storage.get('sidebar-collapsed', false)) {
    sidebar.classList.add('collapsed');
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    Storage.set('sidebar-collapsed', sidebar.classList.contains('collapsed'));
  });

  // 导航点击
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) navigateTo(page);
    });
  });
}

// 系统信息
function initSystemInfo() {
  const ua = navigator.userAgent;
  const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : ua.includes('Edge') ? 'Edge' : 'Other';
  
  const el = (id) => document.getElementById(id);
  if (el('sys-browser')) el('sys-browser').textContent = browser;
  if (el('sys-resolution')) el('sys-resolution').textContent = `${screen.width}×${screen.height}`;
  if (el('sys-lang')) el('sys-lang').textContent = navigator.language || '-';
  if (el('sys-online')) el('sys-online').textContent = navigator.onLine ? '在线 ✅' : '离线 ❌';
  if (el('sys-localtime')) el('sys-localtime').textContent = new Date().toLocaleTimeString();

  // 监听在线状态
  window.addEventListener('online', () => { if (el('sys-online')) el('sys-online').textContent = '在线 ✅'; });
  window.addEventListener('offline', () => { if (el('sys-online')) el('sys-online').textContent = '离线 ❌'; });
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c Terminal · 个人空间 %c v1.0 ',
    'background: linear-gradient(135deg, #00f0ff, #ff6b9d); color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1a1a2e; color: #00f0ff; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );

  // 初始化核心模块
  initSidebar();
  initSystemInfo();

  // 初始化组件
  ClockWidget.init();
  WeatherWidget.init();
  HitokotoWidget.init();
  ShortcutsWidget.init();
  TodoWidget.init();

  // 初始化功能模块
  ToolManager.init();
  LLMManager.init();
  FileManager.init();

  // 初始化设置和效果
  SettingsManager.init();
  AnimeEffects.init();

  // 恢复保存的主题色
  const savedColor = Storage.get('setting-color', 'cyan');
  SettingsManager.applyColor(savedColor);

  // 恢复设置页的hitokoto开关状态
  const hitokotoCard = document.getElementById('hitokoto-card');
  if (hitokotoCard && !Storage.get('setting-hitokoto', true)) {
    hitokotoCard.style.display = 'none';
  }

  // 恢复圆角设置
  const savedRadius = Storage.get('setting-radius');
  if (savedRadius !== null) {
    document.documentElement.style.setProperty('--radius', savedRadius + 'px');
  }

  // 恢复侧边栏位置
  if (Storage.get('setting-sidebar-pos') === 'right') {
    document.querySelector('.app-layout').style.flexDirection = 'row-reverse';
  }

  console.log('✨ 所有模块初始化完成');
});
