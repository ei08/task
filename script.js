// DOM要素の取得
const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const taskCategorySelect = document.getElementById("task-category");
const taskDateInput = document.getElementById("task-date");
const taskTimeInput = document.getElementById("task-time");
const taskList = document.getElementById("tasks");
const searchDateInput = document.getElementById("search-date");
const resetSearchButton = document.getElementById("reset-date");
const searchCategoryInput = document.getElementById("search-category");
const resetCategoryButton = document.getElementById("reset-category");
const noTasksMessage = document.getElementById("no-tasks");
const showTaskListButton = document.getElementById("show-task-list");
const showTaskAddButton = document.getElementById("show-task-add");
const taskInputSection = document.getElementById("task-input");
const taskListSection = document.getElementById("task-list");

// タスクデータを保持する配列
let tasks = [];

// LocalStorageからタスクを読み込む
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

// LocalStorageにタスクを保存する
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// タスクを追加する関数
function addTask(e) {
  e.preventDefault();

  const taskName = taskNameInput.value.trim();
  const taskCategory = taskCategorySelect.value;
  const taskDate = taskDateInput.value;
  const taskTime = taskTimeInput.value.trim();

  if (!taskName || !taskDate || !taskTime) {
    alert("必須項目を入力してください。");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    category: taskCategory,
    date: taskDate,
    time: taskTime,
  };

  tasks.push(newTask);
  saveTasks();
  updateTaskList();
  taskForm.reset();
}

// タスクリストを更新して表示
function updateTaskList() {
  const searchDate = searchDateInput.value.trim();
  const searchCategory = searchCategoryInput.value.trim();

  let filteredTasks = tasks;

  // 日付で絞り込み
  if (searchDate) {
    filteredTasks = filteredTasks.filter((task) => task.date === searchDate);
  }

  // カテゴリーで絞り込み
  if (searchCategory) {
    filteredTasks = filteredTasks.filter((task) => task.category === searchCategory);
  }

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    noTasksMessage.style.display = "block";
    return;
  }

  noTasksMessage.style.display = "none";

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.setAttribute("draggable", "true");
    taskItem.dataset.taskId = task.id;
    taskItem.innerHTML = `
      <div class="task-details">
        <input type="checkbox" class="task-checkbox" data-task-id="${task.id}">
        <span class="task-name">${task.name}</span>
        <span class="task-category">${task.category}</span>
        <span class="task-time">${task.time}</span>
        <span class="task-date">${formatDate(task.date)}</span>
        <span class="drag-handle" title="ドラッグで順序を変更">:::</span>
      </div>
    `;
    taskList.appendChild(taskItem);

    const checkbox = taskItem.querySelector(".task-checkbox");
    let timer;

    checkbox.addEventListener("change", (e) => {
      const taskId = parseInt(e.target.dataset.taskId, 10);

      if (e.target.checked) {
        timer = setTimeout(() => {
          deleteTask(taskId);
        }, 2000);
      } else {
        clearTimeout(timer);
      }
    });
  });

  enableDragAndDrop(); // ドラッグ＆ドロップを有効化
}

// ドラッグ＆ドロップを有効化する関数
function enableDragAndDrop() {
  const taskItems = document.querySelectorAll(".task-item");

  taskItems.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragend", handleDragEnd);
  });
}

let draggedItem = null;

function handleDragStart(e) {
  draggedItem = e.target;
  e.dataTransfer.effectAllowed = "move";
  draggedItem.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const target = e.target.closest(".task-item");
  if (target && target !== draggedItem) {
    const rect = target.getBoundingClientRect();
    const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
    taskList.insertBefore(draggedItem, next ? target.nextSibling : target);
  }
}

function handleDrop() {
  updateTaskOrder();
}

function handleDragEnd() {
  draggedItem.classList.remove("dragging");
  draggedItem = null;
}

// タスク順を更新して保存
function updateTaskOrder() {
  const updatedOrder = Array.from(taskList.children).map((item) =>
    parseInt(item.dataset.taskId, 10)
  );
  tasks.sort((a, b) => updatedOrder.indexOf(a.id) - updatedOrder.indexOf(b.id));
  saveTasks();
}

// タスクを削除する
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  updateTaskList();
}

// 日付のフォーマット
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// イベントリスナー
searchDateInput.addEventListener("input", updateTaskList);
searchCategoryInput.addEventListener("change", updateTaskList);
resetSearchButton.addEventListener("click", () => {
  searchDateInput.value = "";
  updateTaskList();
});
resetCategoryButton.addEventListener("click", () => {
  searchCategoryInput.value = "";
  updateTaskList();
});
showTaskListButton.addEventListener("click", () => {
  taskListSection.classList.add("active");
  taskInputSection.classList.remove("active");
});
showTaskAddButton.addEventListener("click", () => {
  taskInputSection.classList.add("active");
  taskListSection.classList.remove("active");
});
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  updateTaskList();
  if (window.innerWidth <= 768) {
    taskListSection.classList.add("active");
    taskInputSection.classList.remove("active");
  } else {
    taskListSection.classList.add("active");
    taskInputSection.classList.add("active");
  }
});
taskForm.addEventListener("submit", addTask);

// ログイン機能の追加
document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.querySelector('.login-button');
  const loginForm = document.querySelector('.login-form');
  const passwordInput = loginForm.querySelector('input[type="password"]');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const logoutButton = document.createElement('button');
  let isLoginFormVisible = false; // フォームの表示状態を追跡

  // ログアウトボタンの設定
  logoutButton.className = 'logout-button';
  logoutButton.textContent = 'ログアウト';
  document.body.appendChild(logoutButton);

  // ログインボタンクリック時の処理
  loginButton.addEventListener('click', function () {
    if (!isLoginFormVisible) {
      loginForm.style.display = 'flex';
      isLoginFormVisible = true;
    } else {
      hideLoginForm();
      isLoginFormVisible = false;
    }
  });

  // ログインフォームを閉じる際のアニメーション
  function hideLoginForm() {
    const form = document.querySelector('.login-form');
    form.classList.add('hiding');
    form.addEventListener('animationend', () => {
      form.style.display = 'none';
      form.classList.remove('hiding');
    }, { once: true });
  }

  // 正しいパスワード
  const CORRECT_PASSWORD = 'eito0824';

  // ログイン状態の確認と画面の初期表示
  function checkLoginState() {
    if (getCookie('isLoggedIn')) {
      loginForm.style.display = 'none';
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
      loadTasks();
      updateTaskList();
    } else {
      loginForm.style.display = 'none';
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
      taskList.innerHTML = '';
      noTasksMessage.style.display = 'none';
    }
  }

  // パスワード確認処理
  submitButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (passwordInput.value === CORRECT_PASSWORD) {
      setCookie('isLoggedIn', 'true', 30);
      checkLoginState();
      passwordInput.value = '';

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: CORRECT_PASSWORD
        })
      });
    } else {
      alert('パスワードが正しくありません。');
    }
  });

  // ログアウト処理
  logoutButton.addEventListener('click', function () {
    if (confirm('ログアウトしてもよろしいですか？')) {
      document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      checkLoginState();
      passwordInput.value = '';
    }
  });

  // 初期表示時にログイン状態をチェック
  checkLoginState();
});

// Cookie設定用の関数
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

// Cookie取得用の関数
function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

