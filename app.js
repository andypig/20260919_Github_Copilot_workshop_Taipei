const STORAGE_KEY = "offline-todo-list";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const clearButton = document.querySelector("#clear-button");
const themeButton = document.querySelector("#theme-button");
const filterButtons = document.querySelectorAll(".filter-button");
const THEME_KEY = "offline-todo-theme";
const FILTER_KEY = "offline-todo-filter";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

let todos = loadTodos();
let currentFilter = getInitialFilter();

// 優先使用使用者手動選擇的主題，沒有選擇時才跟隨作業系統設定。
function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme || (systemTheme.matches ? "dark" : "light");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeButton.textContent = isDark ? "☀️ 淺色模式" : "🌙 深色模式";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

// 只接受支援的篩選值，避免錯誤資料造成畫面狀態異常。
function getInitialFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);
  const validFilters = ["all", "active", "completed"];
  return validFilters.includes(savedFilter) ? savedFilter : "all";
}

// 從瀏覽器儲存空間讀取待辦資料，資料損壞時回到空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  list.replaceChildren();
  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成待辦事項：${todo.text}`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.type = "button";
    editButton.setAttribute("aria-label", `編輯待辦事項：${todo.text}`);
    editButton.textContent = "編輯";
    editButton.onclick = () => editTodo(todo.id, item, text, editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `刪除待辦事項：${todo.text}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, editButton, deleteButton);
    list.append(item);
  });

  const pendingCount = todos.filter((todo) => !todo.completed).length;
  emptyMessage.hidden = visibleTodos.length > 0;
  if (visibleTodos.length === 0) {
    const emptyMessages = {
      all: "還沒有任何待辦事項,新增一個吧!",
      active: "目前沒有未完成的待辦事項。",
      completed: "目前沒有已完成的待辦事項。"
    };
    emptyMessage.textContent = emptyMessages[currentFilter];
  }
  remainingCount.textContent = `未完成：${pendingCount} 項`;
}

function addTodo(text) {
  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function editTodo(id, item, textElement, editButton) {
  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.type = "text";
  editInput.value = textElement.textContent;
  editInput.setAttribute("aria-label", "編輯待辦事項文字");
  textElement.replaceWith(editInput);
  editButton.textContent = "儲存";
  editButton.setAttribute("aria-label", "儲存待辦事項");

  const saveEdit = () => {
    const editedText = editInput.value.trim();
    if (!editedText) {
      editInput.replaceWith(textElement);
      editButton.textContent = "編輯";
      editButton.setAttribute("aria-label", `編輯待辦事項：${textElement.textContent}`);
      return;
    }

    todos = todos.map((todo) => (
      todo.id === id ? { ...todo, text: editedText } : todo
    ));
    saveTodos();
    renderTodos();
  };

  editButton.onclick = saveEdit;
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveEdit();
    if (event.key === "Escape") {
      editInput.replaceWith(textElement);
      editButton.textContent = "編輯";
    }
  });
  editInput.focus();
  editInput.select();
}

function clearTodos() {
  todos = [];
  saveTodos();
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  addTodo(text);
  form.reset();
  input.focus();
});

clearButton.addEventListener("click", clearTodos);

themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    localStorage.setItem(FILTER_KEY, currentFilter);
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });
    renderTodos();
  });
});

applyTheme(getInitialTheme());
renderTodos();