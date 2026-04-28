/* ============================================
   todo.js — 待办事项组件
   ============================================ */
const TodoWidget = {
  init() {
    this.render();
    const input = document.getElementById('todo-input');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.add();
      });
    }
  },

  getAll() {
    return Storage.get('todos', []);
  },

  save(todos) {
    Storage.set('todos', todos);
    this.render();
  },

  add() {
    const input = document.getElementById('todo-input');
    const text = input?.value?.trim();
    if (!text) return;

    const todos = this.getAll();
    todos.unshift({ id: uid(), text, done: false, created: Date.now() });
    this.save(todos);
    input.value = '';
  },

  toggle(id) {
    const todos = this.getAll();
    const item = todos.find(t => t.id === id);
    if (item) item.done = !item.done;
    this.save(todos);
  },

  remove(id) {
    const todos = this.getAll().filter(t => t.id !== id);
    this.save(todos);
  },

  render() {
    const list = document.getElementById('todo-list');
    const count = document.getElementById('todo-count');
    if (!list) return;

    const todos = this.getAll();
    const pending = todos.filter(t => !t.done).length;
    if (count) count.textContent = pending;

    list.innerHTML = todos.map(t => `
      <li class="todo-item ${t.done ? 'done' : ''}" data-id="${t.id}">
        <div class="todo-check" onclick="TodoWidget.toggle('${t.id}')"></div>
        <span class="todo-text">${this.escapeHtml(t.text)}</span>
        <button class="todo-delete" onclick="TodoWidget.remove('${t.id}')">×</button>
      </li>
    `).join('');
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
