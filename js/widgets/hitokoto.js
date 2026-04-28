/* ============================================
   hitokoto.js — 一言组件
   ============================================ */
const HitokotoWidget = {
  init() {
    this.load();
  },

  async load() {
    const textEl = document.getElementById('hitokoto-text');
    const fromEl = document.getElementById('hitokoto-from');
    if (!textEl) return;

    try {
      const resp = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=k');
      const data = await resp.json();
      textEl.textContent = data.hitokoto;
      fromEl.textContent = data.from ? `—— ${data.from}` : '';
    } catch {
      textEl.textContent = '「即使如此，世界依然美丽。」';
      fromEl.textContent = '';
    }
  },

  refresh() {
    const textEl = document.getElementById('hitokoto-text');
    if (textEl) textEl.textContent = '加载中...';
    this.load();
  }
};
