/* hash-generator.js */
ToolManager.register({
  id: 'hash-generator',
  name: '哈希生成器',
  icon: '#️⃣',
  desc: 'MD5、SHA-1、SHA-256哈希计算',
  category: 'encoding',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div><span class="tool-label">输入文本</span>
        <textarea id="hash-input" class="tool-textarea" style="min-height:100px;" placeholder="输入要计算哈希的文本..." oninput="HashTool.calc()"></textarea></div>
        <div><span class="tool-label">哈希结果</span>
        <div id="hash-results" style="display:flex;flex-direction:column;gap:8px;"></div></div>
      </div>`;
  }
});

const HashTool = {
  async calc() {
    const input = document.getElementById('hash-input')?.value;
    const results = document.getElementById('hash-results');
    if (!input) { results.innerHTML = ''; return; }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const hashes = await Promise.all(algos.map(async algo => {
      const buf = await crypto.subtle.digest(algo, data);
      return { algo, hash: Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('') };
    }));

    results.innerHTML = hashes.map(h => `
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="color-val-label" style="width:60px;">${h.algo}</span>
        <input class="color-val-input" value="${h.hash}" readonly style="flex:1;font-size:11px;" onclick="this.select();navigator.clipboard.writeText(this.value);Toast.success('已复制')">
      </div>
    `).join('');
  }
};
