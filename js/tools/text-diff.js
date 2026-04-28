/* text-diff.js */
ToolManager.register({
  id: 'text-diff',
  name: '文本差异对比',
  icon: '↹',
  desc: '对比两段文本的差异',
  category: 'text',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-actions">
          <button class="btn btn-primary btn-sm" onclick="DiffTool.compare()">对比</button>
          <button class="btn btn-sm" onclick="DiffTool.swap()">交换</button>
          <button class="btn btn-sm" onclick="DiffTool.clear()">清空</button>
        </div>
        <div class="tool-row">
          <div class="tool-col">
            <span class="tool-label">原始文本</span>
            <textarea id="diff-a" class="tool-textarea" style="min-height:200px;" placeholder="原始文本..."></textarea>
          </div>
          <div class="tool-col">
            <span class="tool-label">修改后文本</span>
            <textarea id="diff-b" class="tool-textarea" style="min-height:200px;" placeholder="修改后文本..."></textarea>
          </div>
        </div>
        <div><span class="tool-label">差异结果</span>
        <div id="diff-output" class="diff-output" style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;min-height:100px;max-height:400px;overflow-y:auto;"></div></div>
      </div>`;
  }
});

const DiffTool = {
  compare() {
    const a = document.getElementById('diff-a')?.value || '';
    const b = document.getElementById('diff-b')?.value || '';
    const output = document.getElementById('diff-output');
    
    const linesA = a.split('\n');
    const linesB = b.split('\n');
    const maxLen = Math.max(linesA.length, linesB.length);
    
    let html = '';
    for (let i = 0; i < maxLen; i++) {
      const la = linesA[i] ?? '';
      const lb = linesB[i] ?? '';
      if (la === lb) {
        html += `<div class="diff-line diff-same">  ${this.esc(la)}</div>`;
      } else {
        if (la) html += `<div class="diff-line diff-remove">- ${this.esc(la)}</div>`;
        if (lb) html += `<div class="diff-line diff-add">+ ${this.esc(lb)}</div>`;
      }
    }
    output.innerHTML = html || '<span style="color:var(--text-muted)">两段文本完全相同</span>';
  },
  swap() {
    const a = document.getElementById('diff-a');
    const b = document.getElementById('diff-b');
    [a.value, b.value] = [b.value, a.value];
  },
  clear() {
    document.getElementById('diff-a').value = '';
    document.getElementById('diff-b').value = '';
    document.getElementById('diff-output').innerHTML = '';
  },
  esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
};
