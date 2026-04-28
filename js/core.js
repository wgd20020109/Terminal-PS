/* ============================================
   core.js — 核心工具库
   ============================================ */

// 本地存储封装
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  remove(key) { localStorage.removeItem(key); },
  clear() { localStorage.clear(); }
};

// Toast通知
const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); }
};

// 模态框
const Modal = {
  show(id) {
    document.getElementById(id)?.classList.add('show');
  },
  close(id) {
    document.getElementById(id)?.classList.remove('show');
  }
};

// 事件总线
const EventBus = {
  _handlers: {},
  on(event, handler) {
    (this._handlers[event] ||= []).push(handler);
  },
  emit(event, data) {
    (this._handlers[event] || []).forEach(h => h(data));
  },
  off(event, handler) {
    if (!this._handlers[event]) return;
    this._handlers[event] = this._handlers[event].filter(h => h !== handler);
  }
};

// 日期工具
const DateUtils = {
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  MONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

  format(date, pattern = 'YYYY-MM-DD HH:mm:ss') {
    const d = date || new Date();
    const pad = n => String(n).padStart(2, '0');
    return pattern
      .replace('YYYY', d.getFullYear())
      .replace('MM', pad(d.getMonth() + 1))
      .replace('DD', pad(d.getDate()))
      .replace('HH', pad(d.getHours()))
      .replace('mm', pad(d.getMinutes()))
      .replace('ss', pad(d.getSeconds()))
      .replace('WW', this.WEEKDAYS[d.getDay()]);
  },

  getGreeting() {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 9) return '早上好';
    if (h < 12) return '上午好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    if (h < 22) return '晚上好';
    return '夜深了';
  },

  getLunarInfo() {
    // 简化的农历信息（实际可用lunar库）
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const seasons = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'];
    const month = now.getMonth();
    return `${now.getFullYear()}年 · ${seasons[month]}季 · 第${dayOfYear}天`;
  }
};

// 防抖
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 简易Markdown解析器
const MarkdownParser = {
  parse(text) {
    if (!text) return '';
    return text
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 标题
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // 粗体、斜体
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 引用
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // 无序列表
      .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
      // 分割线
      .replace(/^---$/gm, '<hr>')
      // 段落
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }
};

// 唯一ID生成
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
