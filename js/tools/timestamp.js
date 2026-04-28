/* timestamp.js */
ToolManager.register({
  id: 'timestamp',
  name: '时间戳转换',
  icon: '⏱️',
  desc: 'Unix时间戳与日期互转',
  category: 'dev',
  render(container) {
    const now = Math.floor(Date.now() / 1000);
    container.innerHTML = `
      <div class="tool-panel">
        <div style="text-align:center;padding:16px;background:rgba(var(--accent-rgb),0.05);border-radius:var(--radius-sm);">
          <div style="font:700 32px var(--font-mono);color:var(--accent);">${now}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">当前Unix时间戳（秒）</div>
        </div>
        <div class="tool-row">
          <div class="tool-col">
            <span class="tool-label">时间戳 → 日期</span>
            <input id="ts-input" class="tool-input" placeholder="输入时间戳..." value="${now}" oninput="TsTool.toDate()">
            <div id="ts-result" class="tool-result" style="min-height:auto;"></div>
          </div>
          <div class="tool-col">
            <span class="tool-label">日期 → 时间戳</span>
            <input id="ts-date" type="datetime-local" class="tool-input" oninput="TsTool.toStamp()" style="padding:6px 10px;">
            <div id="ts-date-result" class="tool-result" style="min-height:auto;"></div>
          </div>
        </div>
      </div>`;
  }
});

const TsTool = {
  toDate() {
    const input = document.getElementById('ts-input')?.value?.trim();
    const result = document.getElementById('ts-result');
    if (!input) { result.textContent = ''; return; }
    let ts = parseInt(input);
    if (ts < 1e12) ts *= 1000; // 秒 → 毫秒
    const d = new Date(ts);
    if (isNaN(d.getTime())) { result.textContent = '❌ 无效时间戳'; return; }
    result.textContent = `${DateUtils.format(d, 'YYYY-MM-DD HH:mm:ss')} (${DateUtils.WEEKDAYS[d.getDay()]})`;
  },
  toStamp() {
    const input = document.getElementById('ts-date')?.value;
    const result = document.getElementById('ts-date-result');
    if (!input) { result.textContent = ''; return; }
    const d = new Date(input);
    result.textContent = `秒: ${Math.floor(d.getTime()/1000)}\n毫秒: ${d.getTime()}`;
  }
};
