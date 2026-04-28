/* base64.js */
ToolManager.register({
  id: 'base64',
  name: 'Base64 编解码',
  icon: '🔐',
  desc: 'Base46编码与解码转换',
  category: 'encoding',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-actions">
          <button class="btn btn-sm" onclick="Base64Tool.encode()">编码 →</button>
          <button class="btn btn-sm" onclick="Base64Tool.decode()">← 解码</button>
          <button class="btn btn-sm" onclick="Base64Tool.encodeURI()">URL安全编码</button>
        </div>
        <div class="tool-row">
          <div class="tool-col">
            <span class="tool-label">原文</span>
            <textarea id="b64-input" class="tool-textarea" placeholder="输入要编码的文本..."></textarea>
          </div>
          <div class="tool-col">
            <span class="tool-label">结果</span>
            <textarea id="b64-output" class="tool-textarea" placeholder="Base64结果..."></textarea>
          </div>
        </div>
      </div>`;
  }
});

const Base64Tool = {
  encode() {
    const input = document.getElementById('b64-input')?.value;
    try { document.getElementById('b64-output').value = btoa(unescape(encodeURIComponent(input))); }
    catch (e) { Toast.error('编码失败: ' + e.message); }
  },
  decode() {
    const input = document.getElementById('b64-output')?.value;
    try { document.getElementById('b64-input').value = decodeURIComponent(escape(atob(input))); }
    catch (e) { Toast.error('解码失败: 输入不是有效的Base64'); }
  },
  encodeURI() {
    const input = document.getElementById('b64-input')?.value;
    document.getElementById('b64-output').value = btoa(unescape(encodeURIComponent(input)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};
