const getTodos = () => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

// 必要な要素を取得
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const uncompletedTodoList = document.getElementById('uncompleted-todo-list');
const completedTodoList = document.getElementById('completed-todo-list');

// 新しいTODOアイテムを作成する関数
function createTodoElement(todoText, isCompleted = false) {
  const todoId = generateUUID(); // UUIDを生成
  const todoCard = document.createElement('div');
  todoCard.classList.add('todo-card');
  if (isCompleted) {
    todoCard.classList.add('todo-completed');
  }
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isCompleted;

  // チェックボックスのイベント
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      moveToCompleted(todoId);
    } else {
      moveToUncompleted(todoId);
    }
  });

  const todoTextElement = document.createElement('div'); // <div>に変更
  todoTextElement.classList.add('todo-text');
  todoTextElement.setAttribute('data-id', todoId);
  todoTextElement.setAttribute('contenteditable', 'true');
  todoTextElement.textContent = todoText;

  // Enterキーで改行できるようにする
  todoTextElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 通常のEnter動作を無効化
      insertLineBreak(todoTextElement); // 改行を挿入
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = '削除';

  // 削除ボタンのイベント
  deleteBtn.addEventListener('click', () => {
    deleteTodo(todoId);
  });

  // 要素をカードに追加
  todoCard.appendChild(checkbox);
  todoCard.appendChild(todoTextElement);
  todoCard.appendChild(deleteBtn);

  return todoCard;
}

// 改行を挿入する関数
function insertLineBreak(element) {
  const selection = window.getSelection(); // 現在の選択範囲を取得
  const range = selection.getRangeAt(0); // 選択範囲を取得

  // <br>タグを作成
  const br = document.createElement('br');
  range.deleteContents(); // 現在の選択内容を削除
  range.insertNode(br); // <br>タグを挿入

  // 挿入後、カーソルを改行の後に移動
  range.setStartAfter(br);
  range.setEndAfter(br);

  // 再度選択範囲を設定
  selection.removeAllRanges();
  selection.addRange(range);
}

// UUIDを生成する関数（簡易的な方法）
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// TODOを追加する処理
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const todoText = todoInput.value.trim();
  if (todoText) {
    const todoElement = createTodoElement(todoText);
    uncompletedTodoList.appendChild(todoElement);
    todoInput.value = ''; // 入力欄をクリア
  }
});

// 完了済みのTODOを未完了リストに戻す関数
function moveToUncompleted(todoId) {
  const todoElement = document.querySelector(`[data-id='${todoId}']`).parentElement;
  completedTodoList.removeChild(todoElement);
  uncompletedTodoList.appendChild(todoElement);
  todoElement.classList.remove('todo-completed');
}

// 未完了のTODOを完了リストに移動する関数
function moveToCompleted(todoId) {
  const todoElement = document.querySelector(`[data-id='${todoId}']`).parentElement;
  uncompletedTodoList.removeChild(todoElement);
  completedTodoList.appendChild(todoElement);
  todoElement.classList.add('todo-completed');
}

// TODOを削除する関数
function deleteTodo(todoId) {
  // 削除確認のダイアログを表示
  const confirmDelete = confirm('本当に削除しますか？');

  // ユーザーが「OK」を押した場合
  if (confirmDelete) {
    const todoElement = document.querySelector(`[data-id='${todoId}']`).parentElement;
    if (todoElement) {
      todoElement.remove(); // TODOを削除
    }
  }
}

// 初期化時にlocalStorageからTODOを読み込む（必要に応じて）
document.addEventListener('DOMContentLoaded', () => {
  const todos = getTodos();
  todos.forEach(todo => {
    const todoElement = createTodoElement(todo.text, todo.completed);
    if (todo.completed) {
      completedTodoList.appendChild(todoElement);
    } else {
      uncompletedTodoList.appendChild(todoElement);
    }
  });
});

// 追加されたTODOをlocalStorageに保存する
function saveTodos() {
  const todos = [];
  const allTodos = document.querySelectorAll('.todo-card');
  allTodos.forEach(todoCard => {
    const todoId = todoCard.querySelector('.todo-text').getAttribute('data-id');
    const todoText = todoCard.querySelector('.todo-text').textContent;
    const isCompleted = todoCard.classList.contains('todo-completed');
    todos.push({ id: todoId, text: todoText, completed: isCompleted });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// TODOの変更や削除時にlocalStorageを更新
document.addEventListener('input', saveTodos);
document.addEventListener('click', saveTodos);


[...document.getElementsByClassName('delete-btn')]
  .forEach(node => node.addEventListener('click', () => console.log(confirm('このTODOを削除してもよろしいですか？'))));