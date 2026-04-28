/* ============================================
   clock.js — 时钟组件
   ============================================ */
const ClockWidget = {
  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    const infoEl = document.getElementById('clock-info');
    const greetingEl = document.getElementById('greeting-text');
    const dateDisplay = document.getElementById('date-display');

    if (timeEl) timeEl.textContent = DateUtils.format(now, 'HH:mm:ss');
    if (dateEl) dateEl.textContent = DateUtils.format(now, 'YYYY年MM月DD日 WW');
    if (infoEl) infoEl.textContent = DateUtils.getLunarInfo();
    if (greetingEl) greetingEl.textContent = DateUtils.getGreeting() + ' ✨';
    if (dateDisplay) dateDisplay.textContent = DateUtils.format(now, 'YYYY.MM.DD · WW');
  }
};
