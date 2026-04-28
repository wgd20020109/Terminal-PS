/* ============================================
   files.js — 文件库模块 (基于localStorage的虚拟文件系统)
   ============================================ */
const FileManager = {
  files: [],
  currentPath: '/',
  currentTag: null,

  init() {
    this.files = Storage.get('files', this.getDefaultFiles());
    this.render();
    this.renderTags();
  },

  getDefaultFiles() {
    return [
      { id: uid(), name: '文档', type: 'folder', parent: '/', starred: false, tags: [], created: Date.now(), modified: Date.now() },
      { id: uid(), name: '图片', type: 'folder', parent: '/', starred: false, tags: [], created: Date.now(), modified: Date.now() },
      { id: uid(), name: '代码', type: 'folder', parent: '/', starred: false, tags: [], created: Date.now(), modified: Date.now() },
      { id: uid(), name: '笔记.md', type: 'file', parent: '/', content: '# 我的笔记\n\n在这里记录重要内容...', starred: true, tags: ['笔记'], created: Date.now(), modified: Date.now() },
      { id: uid(), name: '待办清单.md', type: 'file', parent: '/', content: '# 待办清单\n\n- [ ] 完成网站开发\n- [ ] 学习新技能\n- [ ] 看番', starred: false, tags: ['待办'], created: Date.now(), modified: Date.now() },
    ];
  },

  getChildren(path) {
    return this.files.filter(f => f.parent === path);
  },

  render() {
    const grid = document.getElementById('files-grid');
    const breadcrumb = document.getElementById('files-breadcrumb');
    if (!grid) return;

    // 面包屑导航
    if (breadcrumb) {
      const parts = this.currentPath.split('/').filter(Boolean);
      let html = `<a class="quick-item" onclick="FileManager.goTo('/')">🏠 根目录</a>`;
      let cumPath = '';
      parts.forEach(p => {
        cumPath += '/' + p;
        html += ` / <a class="quick-item" onclick="FileManager.goTo('${cumPath}')">${p}</a>`;
      });
      breadcrumb.innerHTML = html;
    }

    const children = this.getChildren(this.currentPath);
    
    if (children.length === 0) {
      grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:48px;opacity:0.3;">📂</div>
        <p style="margin-top:12px;">空文件夹</p>
      </div>`;
      return;
    }

    grid.innerHTML = children.map(f => `
      <div class="file-item ${f.type}" ondblclick="${f.type === 'folder' ? `FileManager.goTo('${this.currentPath}${f.name}/')` : `FileManager.openFile('${f.id}')`}">
        <div class="file-icon">${f.type === 'folder' ? '📁' : this.getFileIcon(f.name)}</div>
        <div class="file-info">
          <div class="file-name">${f.name}</div>
          <div class="file-meta">${DateUtils.format(new Date(f.modified), 'MM-DD HH:mm')}</div>
        </div>
        <div class="file-actions-row">
          <button class="file-action-btn" onclick="event.stopPropagation();FileManager.toggleStar('${f.id}')" title="${f.starred ? '取消收藏' : '收藏'}">
            ${f.starred ? '⭐' : '☆'}
          </button>
          <button class="file-action-btn" onclick="event.stopPropagation();FileManager.rename('${f.id}')" title="重命名">✏️</button>
          <button class="file-action-btn" onclick="event.stopPropagation();FileManager.remove('${f.id}')" title="删除">🗑️</button>
        </div>
      </div>
    `).join('');
  },

  getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    const icons = {
      md: '📝', txt: '📄', pdf: '📕', doc: '📘', docx: '📘',
      jpg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️',
      js: '📜', py: '🐍', html: '🌐', css: '🎨', json: '{}',
      mp3: '🎵', mp4: '🎬', zip: '📦', rar: '📦'
    };
    return icons[ext] || '📄';
  },

  goTo(path) {
    if (path === 'recent') {
      // 显示最近文件
      this.currentPath = '/';
      this.render();
      Toast.info('显示所有文件（按时间排序）');
      return;
    }
    if (path === 'starred') {
      const starred = this.files.filter(f => f.starred);
      const grid = document.getElementById('files-grid');
      if (grid && starred.length) {
        grid.innerHTML = starred.map(f => `
          <div class="file-item ${f.type}">
            <div class="file-icon">${f.type === 'folder' ? '📁' : this.getFileIcon(f.name)}</div>
            <div class="file-info">
              <div class="file-name">${f.name}</div>
              <div class="file-meta">${f.parent}</div>
            </div>
          </div>
        `).join('');
      } else if (grid) {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">没有收藏的文件</div>';
      }
      return;
    }
    this.currentPath = path;
    this.render();
  },

  createFolder() {
    const name = prompt('文件夹名称:');
    if (!name) return;
    this.files.push({
      id: uid(), name, type: 'folder', parent: this.currentPath,
      starred: false, tags: [], created: Date.now(), modified: Date.now()
    });
    this.save();
    this.render();
    Toast.success(`创建文件夹: ${name}`);
  },

  uploadFile() {
    const name = prompt('文件名称（含扩展名）:');
    if (!name) return;
    const content = prompt('文件内容（可留空）:') || '';
    this.files.push({
      id: uid(), name, type: 'file', parent: this.currentPath,
      content, starred: false, tags: [], created: Date.now(), modified: Date.now()
    });
    this.save();
    this.render();
    Toast.success(`上传文件: ${name}`);
  },

  openFile(id) {
    const file = this.files.find(f => f.id === id);
    if (!file) return;
    const content = prompt(`编辑 ${file.name}:`, file.content || '');
    if (content !== null) {
      file.content = content;
      file.modified = Date.now();
      this.save();
      Toast.success('文件已保存');
    }
  },

  toggleStar(id) {
    const file = this.files.find(f => f.id === id);
    if (file) {
      file.starred = !file.starred;
      this.save();
      this.render();
    }
  },

  rename(id) {
    const file = this.files.find(f => f.id === id);
    if (!file) return;
    const name = prompt('新名称:', file.name);
    if (name) {
      file.name = name;
      file.modified = Date.now();
      this.save();
      this.render();
    }
  },

  remove(id) {
    if (!confirm('确定删除？')) return;
    this.files = this.files.filter(f => f.id !== id);
    this.save();
    this.render();
    Toast.info('已删除');
  },

  renderTags() {
    const tagList = document.getElementById('tag-list');
    if (!tagList) return;
    const tags = new Set();
    this.files.forEach(f => (f.tags || []).forEach(t => tags.add(t)));
    tagList.innerHTML = [...tags].map(t => 
      `<a class="quick-item" onclick="FileManager.filterByTag('${t}')">🏷️ ${t}</a>`
    ).join('') || '<span style="font-size:12px;color:var(--text-muted);padding:8px;">暂无标签</span>';
  },

  filterByTag(tag) {
    const filtered = this.files.filter(f => (f.tags || []).includes(tag));
    const grid = document.getElementById('files-grid');
    if (grid) {
      grid.innerHTML = filtered.map(f => `
        <div class="file-item ${f.type}">
          <div class="file-icon">${f.type === 'folder' ? '📁' : this.getFileIcon(f.name)}</div>
          <div class="file-info">
            <div class="file-name">${f.name}</div>
            <div class="file-meta">${f.parent}</div>
          </div>
        </div>
      `).join('') || `<div style="text-align:center;padding:40px;color:var(--text-muted);">标签 "${tag}" 下无文件</div>`;
    }
  },

  save() {
    Storage.set('files', this.files);
    this.renderTags();
  }
};
