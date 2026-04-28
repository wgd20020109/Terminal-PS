/* uuid-generator.js */
ToolManager.register({
  id: 'uuid-generator',
  name: 'UUID 生成器',
  icon: '🆔',
  desc: '生成UUID/GUID唯一标识符',
  category: 'generate',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-actions">
          <button class="btn btn-primary btn-sm" onclick="UUIDTool.generate()">生成 UUID</button>
          <button class="btn btn-sm" onclick="UUIDTool.generateBatch(10)">批量生成 ×10</button>
          <button class="btn btn-sm" onclick="UUIDTool.copyAll()">复制全部</button>
        </div>
        <div><span class="tool-label">数量</span>
        <input id="uuid-count" class="tool-input" type="number" value="1" min="1" max="100" style="width:100px;"></div>
        <div><span class="tool-label">结果</span>
        <textarea id="uuid-output" class="tool-textarea" readonly style="min-height:200px;font-size:12px;"></textarea></div>
      </div>`;
    setTimeout(() => UUIDTool.generate(), 100);
  }
});

const UUIDTool = {
  v4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  generate() {
    const count = parseInt(document.getElementById('uuid-count')?.value) || 1;
    const output = document.getElementById('uuid-output');
    const uuids = Array.from({length: Math.min(count, 100)}, () => this.v4());
    output.value = uuids.join('\n');
  },
  generateBatch(n) {
    document.getElementById('uuid-count').value = n;
    this.generate();
  },
  copyAll() {
    const output = document.getElementById('uuid-output');
    navigator.clipboard.writeText(output.value);
    Toast.success('已复制到剪贴板');
  }
};
