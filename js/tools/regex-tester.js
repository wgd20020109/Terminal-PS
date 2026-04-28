/* regex-tester.js */
ToolManager.register({
  id: 'regex-tester',
  name: '正则表达式测试',
  icon: '.*',
  desc: '正则表达式在线测试与匹配',
  category: 'text',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-row" style="gap:8px;align-items:center;">
          <span style="color:var(--text-muted);font:13px var(--font-mono)">/</span>
          <input id="regex-pattern" class="tool-input" placeholder="正则表达式" style="flex:2" oninput="RegexTool.test()">
          <span style="color:var(--text-muted);font:13px var(--font-mono)">/</span>
          <input id="regex-flags" class="tool-input" value="g" placeholder="flags" style="width:60px" oninput="RegexTool.test()">
        </div>
        <div>
          <span class="tool-label">测试文本</span>
          <textarea id="regex-text" class="tool-textarea" style="min-height:100px;" placeholder="输入要测试的文本..." oninput="RegexTool.test()"></textarea>
        </div>
        <div>
          <span class="tool-label">匹配结果</span>
          <div id="regex-result" class="regex-matches"></div>
        </div>
      </div>`;
  }
});

const RegexTool = {
  test() {
    const pattern = document.getElementById('regex-pattern')?.value;
    const flags = document.getElementById('regex-flags')?.value || 'g';
    const text = document.getElementById('regex-text')?.value;
    const result = document.getElementById('regex-result');
    if (!pattern || !text) { result.innerHTML = ''; return; }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
      if (matches.length === 0) {
        result.innerHTML = '<span style="color:var(--text-muted)">无匹配</span>';
      } else {
        result.innerHTML = `<span style="color:var(--text-muted);font-size:12px">找到 ${matches.length} 个匹配</span>` +
          matches.map(m => `<div class="regex-match">[${m.index}] "${m[0]}"</div>`).join('');
      }
    } catch (e) {
      result.innerHTML = `<span style="color:#ff4757">错误: ${e.message}</span>`;
    }
  }
};
