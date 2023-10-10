// ToDoItem Class
var ToDoItem = /** @class */ (function () {
    function ToDoItem(id, text, completed) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
    return ToDoItem;
}());
// ToDoList Class
var ToDoList = /** @class */ (function () {
    function ToDoList() {
        this.items = [];
        // set DOM element as property
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.completeList = document.getElementById('complete-list');
        this.clearButton = document.getElementById('clear-button');
        // listen form submit event
        this.form.addEventListener('submit', this.addTask.bind(this));
        // listen task clear button click event
        this.clearButton.addEventListener('click', this.clearList.bind(this));
        // get from localstorage
        this.loadTasks();
    }
    //add tasks method
    ToDoList.prototype.addTask = function (event) {
        event.preventDefault();
        //check form
        var taskText = this.input.value.trim();
        if (taskText === '')
            return;
        //set id
        var newId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
        //cretae new Task obj
        var newTask = new ToDoItem(newId, taskText, false);
        this.items.push(newTask);
        //save new data in localstorage
        this.saveTasks();
        //update Lists
        this.displayTasks();
        this.input.value = '';
    };
    // tasks completed toggle method
    ToDoList.prototype.toggleTaskCompletion = function (task) {
        task.completed = !task.completed;
        //save new data in localstorage
        this.saveTasks();
        this.displayTasks();
    };
    // display task method
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
                // change completed status by listening checkbox change event
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
    // delete task event
    ToDoList.prototype.deleteTask = function (task) {
        var taskIndex = this.items.indexOf(task);
        if (taskIndex !== -1) {
            this.items.splice(taskIndex, 1);
            this.saveTasks();
            this.displayTasks();
        }
    };
    // clear tasks
    ToDoList.prototype.clearList = function () {
        this.items = [];
        this.saveTasks();
        this.displayTasks();
    };
    // save tasks in localstorage
    ToDoList.prototype.saveTasks = function () {
        localStorage.setItem('tasks', JSON.stringify(this.items));
    };
    // read tasks from localstorage
    ToDoList.prototype.loadTasks = function () {
        var savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.items = JSON.parse(savedTasks);
            this.displayTasks();
        }
    };
    return ToDoList;
}());
// create ToDoList instance
var toDoList = new ToDoList();
