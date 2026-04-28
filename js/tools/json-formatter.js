/* json-formatter.js */
ToolManager.register({
  id: 'json-formatter',
  name: 'JSON 格式化',
  icon: '{ }',
  desc: 'JSON美化、压缩、验证',
  category: 'format',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-actions">
          <button class="btn btn-sm" onclick="JSONTool.format()">美化</button>
          <button class="btn btn-sm" onclick="JSONTool.minify()">压缩</button>
          <button class="btn btn-sm" onclick="JSONTool.validate()">验证</button>
          <button class="btn btn-sm" onclick="JSONTool.sample()">示例</button>
          <button class="btn btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('json-output').value);Toast.success('已复制')">复制结果</button>
        </div>
        <div class="tool-row">
          <div class="tool-col">
            <span class="tool-label">输入 JSON</span>
            <textarea id="json-input" class="tool-textarea" placeholder='粘贴JSON...'></textarea>
          </div>
          <div class="tool-col">
            <span class="tool-label">输出</span>
            <textarea id="json-output" class="tool-textarea" readonly></textarea>
          </div>
        </div>
      </div>`;
  }
});

const JSONTool = {
  format() {
    const input = document.getElementById('json-input')?.value;
    const output = document.getElementById('json-output');
    try { output.value = JSON.stringify(JSON.parse(input), null, 2); }
    catch (e) { output.value = '❌ JSON解析错误: ' + e.message; }
  },
  minify() {
    const input = document.getElementById('json-input')?.value;
    const output = document.getElementById('json-output');
    try { output.value = JSON.stringify(JSON.parse(input)); }
    catch (e) { output.value = '❌ JSON解析错误: ' + e.message; }
  },
  validate() {
    const input = document.getElementById('json-input')?.value;
    const output = document.getElementById('json-output');
    try { JSON.parse(input); output.value = '✅ JSON格式正确'; }
    catch (e) { output.value = '❌ ' + e.message; }
  },
  sample() {
    document.getElementById('json-input').value = JSON.stringify({
      name: "Terminal", version: "1.0", features: ["tools", "llm", "files"],
      config: { theme: "cyber", anime: true }
    }, null, 2);
  }
};
