// ToDoアイテムのクラス
var ToDoItem = /** @class */ (function () {
    function ToDoItem(id, text, completed) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
    return ToDoItem;
}());
// ToDoリストのクラス
var ToDoList = /** @class */ (function () {
    function ToDoList() {
        this.items = [];
        // フォームとリストのDOM要素を取得
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.completeList = document.getElementById('complete-list');
        this.clearButton = document.getElementById('clear-button');
        // フォームの送信イベントをリッスン
        this.form.addEventListener('submit', this.addTask.bind(this));
        // タスククリアボタンのクリックイベントをリッスン
        this.clearButton.addEventListener('click', this.clearList.bind(this));
        // ローカルストレージからタスクを復元
        this.loadTasks();
    }
    // タスクを追加
    ToDoList.prototype.addTask = function (event) {
        event.preventDefault();
        var taskText = this.input.value.trim();
        if (taskText === '')
            return;
        var newId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
        var newTask = new ToDoItem(newId, taskText, false);
        this.items.push(newTask);
        this.saveTasks();
        this.displayTasks();
        this.input.value = '';
    };
    // タスクの完了状態をトグルするメソッド
    ToDoList.prototype.toggleTaskCompletion = function (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.displayTasks();
    };
    // タスクを表示
    ToDoList.prototype.displayTasks = function () {
        var _this = this;
        //Display Tasks
        this.list.innerHTML = '';
        this.items.forEach(function (task) {
            if (!task.completed) {
                var listItem = document.createElement('li');
                listItem.innerHTML = "\n                    <div class='list-content'>\n                    <input type=\"checkbox\" ".concat(task.completed ? 'checked' : '', " id=todo-").concat(task.id, ">\n                    <span><strong>").concat(task.text, "</strong></span>\n                    </div>\n                    <button class=\"delete-button\">Delete</button>\n                ");
                var deleteButton = listItem.querySelector('.delete-button');
                deleteButton.addEventListener('click', function () { return _this.deleteTask(task); });
                // チェックボックスの変更イベントをリッスンし、完了状態をトグル
                var checkbox = listItem.querySelector("#todo-".concat(task.id));
                checkbox.addEventListener('change', function () { return _this.toggleTaskCompletion(task); });
                _this.list.appendChild(listItem);
            }
        });
        //Completed Tasks
        this.completeList.innerHTML = '';
        this.items.forEach(function (task) {
            if (task.completed) {
                var listItem = document.createElement('li');
                listItem.innerHTML = "\n                    <div class='list-content'>\n                    <input type=\"checkbox\" ".concat(task.completed ? 'checked' : '', " id=todo-").concat(task.id, ">\n                    <span><del><strong>").concat(task.text, "</strong></del></span>\n                    </div>\n                    <button class=\"delete-button\">Delete</button>\n                ");
                var deleteButton = listItem.querySelector('.delete-button');
                deleteButton.addEventListener('click', function () { return _this.deleteTask(task); });
                var checkbox = listItem.querySelector("#todo-".concat(task.id));
                checkbox.addEventListener('change', function () { return _this.toggleTaskCompletion(task); });
                _this.completeList.appendChild(listItem);
            }
        });
    };
    // タスクを削除
    ToDoList.prototype.deleteTask = function (task) {
        var taskIndex = this.items.indexOf(task);
        if (taskIndex !== -1) {
            this.items.splice(taskIndex, 1);
            this.saveTasks();
            this.displayTasks();
        }
    };
    // タスクをクリア
    ToDoList.prototype.clearList = function () {
        this.items = [];
        this.saveTasks();
        this.displayTasks();
    };
    // タスクをローカルストレージに保存
    ToDoList.prototype.saveTasks = function () {
        localStorage.setItem('tasks', JSON.stringify(this.items));
    };
    // タスクをローカルストレージから読み込み
    ToDoList.prototype.loadTasks = function () {
        var savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.items = JSON.parse(savedTasks);
            this.displayTasks();
        }
    };
    return ToDoList;
}());
// ToDoリストのインスタンスを作成
var toDoList = new ToDoList();
