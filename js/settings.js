/* ============================================
   settings.js — 设置管理模块
   ============================================ */
const SettingsManager = {
  init() {
    // 加载保存的设置
    const color = Storage.get('setting-color', 'cyan');
    this.applyColor(color);
    this.initTheme();
    this.bindEvents();
  },

  // ===== 主题切换 =====
  initTheme() {
    const autoTheme = Storage.get('setting-auto-theme', false);
    const isDark = Storage.get('setting-dark-mode', true);

    if (autoTheme) {
      this.applyAutoTheme();
    } else {
      this.applyTheme(isDark ? 'dark' : 'light');
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('setting-dark-mode', theme === 'dark');
    // 同步开关状态
    const toggle = document.getElementById('setting-dark-mode');
    if (toggle) toggle.checked = (theme === 'dark');
  },

  applyAutoTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyTheme(prefersDark.matches ? 'dark' : 'light');
    // 监听系统主题变化
    prefersDark.addEventListener('change', (e) => {
      if (Storage.get('setting-auto-theme', false)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  bindEvents() {
    // 深色模式开关
    const darkMode = document.getElementById('setting-dark-mode');
    if (darkMode) {
      darkMode.checked = Storage.get('setting-dark-mode', true);
      darkMode.addEventListener('change', () => {
        // 关闭自动跟随
        const autoToggle = document.getElementById('setting-auto-theme');
        if (autoToggle) { autoToggle.checked = false; Storage.set('setting-auto-theme', false); }
        this.applyTheme(darkMode.checked ? 'dark' : 'light');
      });
    }

    // 自动跟随系统
    const autoTheme = document.getElementById('setting-auto-theme');
    if (autoTheme) {
      autoTheme.checked = Storage.get('setting-auto-theme', false);
      autoTheme.addEventListener('change', () => {
        Storage.set('setting-auto-theme', autoTheme.checked);
        if (autoTheme.checked) {
          this.applyAutoTheme();
        }
      });
    }

    // 主题色预设
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.applyColor(dot.dataset.color);
        Storage.set('setting-color', dot.dataset.color);
      });
    });

    // 自定义颜色
    const picker = document.getElementById('custom-color');
    if (picker) {
      picker.addEventListener('input', () => {
        this.applyCustomColor(picker.value);
      });
    }

    // 二次元开关
    const sakura = document.getElementById('setting-sakura');
    if (sakura) {
      sakura.checked = Storage.get('setting-sakura', true);
      sakura.addEventListener('change', () => AnimeEffects.updateSetting('sakura', sakura.checked));
    }

    const particles = document.getElementById('setting-particles');
    if (particles) {
      particles.checked = Storage.get('setting-particles', true);
      particles.addEventListener('change', () => AnimeEffects.updateSetting('particles', particles.checked));
    }

    const hitokoto = document.getElementById('setting-hitokoto');
    if (hitokoto) {
      hitokoto.checked = Storage.get('setting-hitokoto', true);
      hitokoto.addEventListener('change', () => {
        Storage.set('setting-hitokoto', hitokoto.checked);
        const card = document.getElementById('hitokoto-card');
        if (card) card.style.display = hitokoto.checked ? '' : 'none';
      });
    }

    const glow = document.getElementById('setting-glow');
    if (glow) {
      glow.checked = Storage.get('setting-glow', true);
      glow.addEventListener('change', () => AnimeEffects.updateSetting('glow', glow.checked));
    }

    // 圆角
    const radius = document.getElementById('setting-radius');
    if (radius) {
      radius.value = Storage.get('setting-radius', 12);
      radius.addEventListener('input', () => {
        document.documentElement.style.setProperty('--radius', radius.value + 'px');
        Storage.set('setting-radius', radius.value);
      });
    }

    // 侧边栏位置
    const sidebarPos = document.getElementById('setting-sidebar-pos');
    if (sidebarPos) {
      sidebarPos.value = Storage.get('setting-sidebar-pos', 'left');
      sidebarPos.addEventListener('change', () => {
        const layout = document.querySelector('.app-layout');
        if (sidebarPos.value === 'right') {
          layout.style.flexDirection = 'row-reverse';
        } else {
          layout.style.flexDirection = '';
        }
        Storage.set('setting-sidebar-pos', sidebarPos.value);
      });
    }
  },

  applyColor(name) {
    const colors = {
      cyan:   { accent: '#00f0ff', rgb: '0, 240, 255', dim: '#00a8b3' },
      pink:   { accent: '#ff6b9d', rgb: '255, 107, 157', dim: '#cc5580' },
      purple: { accent: '#b48eff', rgb: '180, 142, 255', dim: '#8c6acc' },
      green:  { accent: '#00ff88', rgb: '0, 255, 136', dim: '#00cc6d' },
      orange: { accent: '#ff9f43', rgb: '255, 159, 67', dim: '#cc7f36' },
    };
    const c = colors[name] || colors.cyan;
    const root = document.documentElement;
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-rgb', c.rgb);
    root.style.setProperty('--accent-dim', c.dim);
    root.style.setProperty('--accent-glow', `rgba(${c.rgb}, 0.3)`);
  },

  applyCustomColor(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    const root = document.documentElement;
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--accent-dim', hex);
    // 更新预设选中状态
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  },

  exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `terminal-backup-${DateUtils.format(new Date(), 'YYYY-MM-DD')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast.success('数据已导出');
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!confirm(`即将导入 ${Object.keys(data).length} 条数据，这将覆盖现有数据。继续？`)) return;
        localStorage.clear();
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
        Toast.success('数据已导入，页面将刷新');
        setTimeout(() => location.reload(), 1000);
      } catch (e) {
        Toast.error('导入失败: ' + e.message);
      }
    };
    input.click();
  },

  clearData() {
    if (!confirm('⚠️ 这将清除所有数据（包括设置、待办、对话记录等），不可恢复！确定？')) return;
    if (!confirm('最终确认：真的要清除所有数据吗？')) return;
    localStorage.clear();
    Toast.info('数据已清除，页面将刷新');
    setTimeout(() => location.reload(), 1000);
  }
};
