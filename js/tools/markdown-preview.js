/* markdown-preview.js */
ToolManager.register({
  id: 'markdown-preview',
  name: 'Markdown 预览',
  icon: 'M↓',
  desc: '实时Markdown渲染预览',
  category: 'text',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-row">
          <div class="tool-col">
            <span class="tool-label">Markdown 源码</span>
            <textarea id="md-input" class="tool-textarea" style="min-height:300px;" oninput="MdTool.preview()" placeholder="# 标题\n\n正文内容...">## Hello World 👋

这是一个 **Markdown** 预览工具。

### 功能
- 标题、粗体、斜体
- 列表、链接
- 代码块、引用
- 表格

> 引用文本示例

\`\`\`javascript
console.log('Hello!');
\`\`\`

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |</textarea>
          </div>
          <div class="tool-col">
            <span class="tool-label">预览</span>
            <div id="md-preview" class="md-preview"></div>
          </div>
        </div>
      </div>`;
    setTimeout(() => MdTool.preview(), 100);
  }
});

const MdTool = {
  preview() {
    const input = document.getElementById('md-input')?.value;
    const preview = document.getElementById('md-preview');
    if (input !== undefined && preview) {
      preview.innerHTML = MarkdownParser.parse(input);
    }
  }
};
