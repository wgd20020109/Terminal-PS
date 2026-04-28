/* ============================================
   llm.js — 大模型管理模块
   ============================================ */
const LLMManager = {
  config: { models: [], prompts: [] },
  chats: [],
  currentChat: null,

  init() {
    this.config = Storage.get('llm-config', {
      models: [
        { id: 'openai-gpt4', name: 'GPT-4o', provider: 'OpenAI', endpoint: '', apiKey: '', model: 'gpt-4o' },
        { id: 'openai-gpt35', name: 'GPT-3.5 Turbo', provider: 'OpenAI', endpoint: '', apiKey: '', model: 'gpt-3.5-turbo' },
        { id: 'claude-3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', endpoint: '', apiKey: '', model: 'claude-3-5-sonnet-20241022' },
        { id: 'custom', name: '自定义模型', provider: 'Custom', endpoint: '', apiKey: '', model: '' },
      ],
      prompts: [
        { id: 'translate', name: '翻译助手', prompt: '你是一个专业的翻译助手，请将用户输入的内容翻译成目标语言。如果没有指定语言，默认翻译成中文。', icon: '🌐' },
        { id: 'code-review', name: '代码审查', prompt: '你是一个资深软件工程师，请对用户提供的代码进行审查，指出潜在问题、安全隐患和优化建议。', icon: '🔍' },
        { id: 'writing', name: '写作助手', prompt: '你是一个专业的写作助手，帮助用户润色、改写和优化文本内容。请保持原意的同时提升表达质量。', icon: '✍️' },
        { id: 'explain', name: '概念解释', prompt: '请用简单易懂的方式解释用户提出的概念或问题，可以使用类比和例子来辅助说明。', icon: '💡' },
        { id: 'summarize', name: '摘要生成', prompt: '请对用户提供的内容生成简洁准确的摘要，抓住核心要点。', icon: '📝' },
      ]
    });

    this.chats = Storage.get('llm-chats', []);
    this.renderChatList();
    this.renderModelSelect();

    // 绑定输入事件
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          this.send();
        }
      });
      // 自动调整高度
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      });
    }
  },

  renderModelSelect() {
    const select = document.getElementById('model-select');
    if (!select) return;
    select.innerHTML = '<option value="">选择模型...</option>' +
      this.config.models.map(m => `<option value="${m.id}">${m.name} (${m.provider})</option>`).join('');
    
    select.addEventListener('change', () => {
      const model = this.config.models.find(m => m.id === select.value);
      const info = document.getElementById('model-info');
      if (info && model) {
        info.textContent = `${model.provider} · ${model.model || '自定义'}`;
      }
    });
  },

  renderChatList() {
    const list = document.getElementById('chat-list');
    if (!list) return;
    list.innerHTML = this.chats.map(chat => `
      <div class="chat-item ${this.currentChat?.id === chat.id ? 'active' : ''}" data-id="${chat.id}">
        <span class="chat-item-icon">💬</span>
        <div class="chat-item-info" onclick="LLMManager.loadChat('${chat.id}')">
          <div class="chat-item-title">${this.escapeHtml(chat.title)}</div>
          <div class="chat-item-meta">${chat.messages.length} 条消息</div>
        </div>
        <button class="chat-item-delete" onclick="LLMManager.deleteChat('${chat.id}')">×</button>
      </div>
    `).join('');
  },

  newChat() {
    const chat = {
      id: uid(),
      title: '新对话 ' + DateUtils.format(new Date(), 'HH:mm'),
      messages: [],
      modelId: document.getElementById('model-select')?.value || '',
      created: Date.now()
    };
    this.chats.unshift(chat);
    this.saveChats();
    this.loadChat(chat.id);
  },

  loadChat(id) {
    const chat = this.chats.find(c => c.id === id);
    if (!chat) return;
    this.currentChat = chat;
    this.renderChatList();
    this.renderMessages();
    
    if (chat.modelId) {
      document.getElementById('model-select').value = chat.modelId;
    }
  },

  deleteChat(id) {
    this.chats = this.chats.filter(c => c.id !== id);
    if (this.currentChat?.id === id) this.currentChat = null;
    this.saveChats();
    this.renderChatList();
    this.renderMessages();
  },

  renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    if (!this.currentChat || this.currentChat.messages.length === 0) {
      container.innerHTML = `<div class="chat-empty"><div class="chat-empty-icon">🤖</div><p>选择一个模型，开始对话</p></div>`;
      return;
    }

    container.innerHTML = this.currentChat.messages.map(msg => `
      <div class="chat-msg ${msg.role}">
        <div class="chat-msg-avatar">${msg.role === 'user' ? '👤' : '🤖'}</div>
        <div>
          <div class="chat-msg-body">${this.formatMessage(msg.content)}</div>
          <div class="chat-msg-time">${DateUtils.format(new Date(msg.time), 'HH:mm')}</div>
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  },

  formatMessage(content) {
    // 简单的代码块格式化
    return this.escapeHtml(content)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  },

  async send() {
    const input = document.getElementById('chat-input');
    const text = input?.value?.trim();
    if (!text) return;

    const modelId = document.getElementById('model-select')?.value;
    if (!modelId) {
      Toast.error('请先选择一个模型');
      return;
    }

    const model = this.config.models.find(m => m.id === modelId);
    if (!model) return;

    // 如果没有当前对话，创建一个
    if (!this.currentChat) {
      this.newChat();
    }

    // 添加用户消息
    this.currentChat.messages.push({
      role: 'user',
      content: text,
      time: Date.now()
    });

    // 更新标题
    if (this.currentChat.messages.length === 1) {
      this.currentChat.title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    input.value = '';
    input.style.height = 'auto';
    this.renderMessages();
    this.renderChatList();

    // 调用API
    if (model.apiKey && model.endpoint) {
      try {
        const response = await this.callAPI(model, this.currentChat.messages);
        this.currentChat.messages.push({
          role: 'assistant',
          content: response,
          time: Date.now()
        });
      } catch (e) {
        this.currentChat.messages.push({
          role: 'assistant',
          content: `❌ API调用失败: ${e.message}`,
          time: Date.now()
        });
      }
    } else {
      // 模拟响应（未配置API时）
      this.currentChat.messages.push({
        role: 'assistant',
        content: `⚙️ 模型 "${model.name}" 尚未配置API密钥。\n\n请在「模型配置」中设置Endpoint和API Key后重试。\n\n当前配置:\n- Provider: ${model.provider}\n- Model: ${model.model || '自定义'}`,
        time: Date.now()
      });
    }

    this.renderMessages();
    this.saveChats();
  },

  async callAPI(model, messages) {
    const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
    
    if (model.provider === 'OpenAI' || model.provider === 'Custom') {
      const resp = await fetch(model.endpoint + '/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        body: JSON.stringify({
          model: model.model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || '（无响应内容）';
    }
    
    if (model.provider === 'Anthropic') {
      const resp = await fetch(model.endpoint || 'https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': model.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model.model,
          messages: apiMessages,
          max_tokens: 2000
        })
      });
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      return data.content?.[0]?.text || '（无响应内容）';
    }

    throw new Error('不支持的Provider: ' + model.provider);
  },

  showConfig() {
    const body = document.getElementById('llm-config-body');
    if (!body) return;

    body.innerHTML = `
      <div class="config-list">
        ${this.config.models.map((m, i) => `
          <div class="config-item">
            <div class="config-item-header">
              <span class="config-item-name">${m.name}</span>
              <button class="btn btn-sm btn-danger" onclick="LLMManager.removeModel(${i})">删除</button>
            </div>
            <div class="config-fields">
              <div class="config-field">
                <label>名称</label>
                <input value="${m.name}" onchange="LLMManager.updateModel(${i}, 'name', this.value)">
              </div>
              <div class="config-field">
                <label>Provider</label>
                <select onchange="LLMManager.updateModel(${i}, 'provider', this.value)">
                  <option ${m.provider==='OpenAI'?'selected':''}>OpenAI</option>
                  <option ${m.provider==='Anthropic'?'selected':''}>Anthropic</option>
                  <option ${m.provider==='Custom'?'selected':''}>Custom</option>
                </select>
              </div>
              <div class="config-field">
                <label>Endpoint</label>
                <input value="${m.endpoint || ''}" placeholder="https://api.openai.com" onchange="LLMManager.updateModel(${i}, 'endpoint', this.value)">
              </div>
              <div class="config-field">
                <label>API Key</label>
                <input type="password" value="${m.apiKey || ''}" placeholder="sk-..." onchange="LLMManager.updateModel(${i}, 'apiKey', this.value)">
              </div>
              <div class="config-field">
                <label>Model ID</label>
                <input value="${m.model || ''}" placeholder="gpt-4o" onchange="LLMManager.updateModel(${i}, 'model', this.value)">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px;">
        <button class="btn btn-primary" onclick="LLMManager.addModel()">+ 添加模型</button>
      </div>
    `;

    Modal.show('modal-llm-config');
  },

  updateModel(index, field, value) {
    this.config.models[index][field] = value;
    Storage.set('llm-config', this.config);
    this.renderModelSelect();
  },

  addModel() {
    this.config.models.push({
      id: uid(),
      name: '新模型',
      provider: 'Custom',
      endpoint: '',
      apiKey: '',
      model: ''
    });
    Storage.set('llm-config', this.config);
    this.showConfig();
    this.renderModelSelect();
  },

  removeModel(index) {
    this.config.models.splice(index, 1);
    Storage.set('llm-config', this.config);
    this.showConfig();
    this.renderModelSelect();
  },

  showPrompts() {
    const body = document.getElementById('prompts-body');
    if (!body) return;

    body.innerHTML = `
      <div class="prompt-grid">
        ${this.config.prompts.map(p => `
          <div class="prompt-card" onclick="LLMManager.usePrompt('${p.id}')">
            <div class="prompt-card-title">${p.icon} ${p.name}</div>
            <div class="prompt-card-desc">${p.prompt.slice(0, 80)}...</div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="LLMManager.addPrompt()">+ 添加模板</button>
      </div>
    `;

    Modal.show('modal-prompts');
  },

  usePrompt(id) {
    const prompt = this.config.prompts.find(p => p.id === id);
    if (!prompt) return;
    
    if (!this.currentChat) this.newChat();
    
    // 设置系统提示
    this.currentChat.systemPrompt = prompt.prompt;
    Modal.close('modal-prompts');
    Toast.info(`已加载模板: ${prompt.name}`);
  },

  addPrompt() {
    const name = prompt('模板名称:');
    if (!name) return;
    const content = prompt('Prompt内容:');
    if (!content) return;
    this.config.prompts.push({ id: uid(), name, prompt: content, icon: '📝' });
    Storage.set('llm-config', this.config);
    this.showPrompts();
  },

  saveChats() {
    Storage.set('llm-chats', this.chats);
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
