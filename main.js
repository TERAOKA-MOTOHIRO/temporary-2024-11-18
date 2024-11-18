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

  const todoTextElement = document.createElement('span');
  todoTextElement.classList.add('todo-text');
  todoTextElement.setAttribute('data-id', todoId);
  todoTextElement.setAttribute('contenteditable', 'true');
  todoTextElement.textContent = todoText;

    // Enterキーで改行できるようにする
    todoTextElement.addEventListener('keydown', (e) => {
      todoTextElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // 通常のEnter動作を無効化
    
          // カーソル位置に <br> を挿入
          insertLineBreak(todoTextElement);
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




[...document.getElementsByClassName('delete-btn')]
  .forEach(node => node.addEventListener('click', () => console.log(confirm('このTODOを削除してもよろしいですか？'))));