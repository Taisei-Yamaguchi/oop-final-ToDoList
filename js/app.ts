// ToDoアイテムのクラス
class ToDoItem {
    constructor(public id: number, public text: string, public completed: boolean) {}
}

// ToDoリストのクラス
class ToDoList {
    private items: ToDoItem[] = [];

    // フォームとリストのDOM要素
    private form: HTMLFormElement;
    private input: HTMLInputElement;
    private list: HTMLUListElement;
    private completeList: HTMLUListElement;  
    private clearButton: HTMLButtonElement;

    constructor() {
        // フォームとリストのDOM要素を取得
        this.form = document.getElementById('todo-form') as HTMLFormElement;
        this.input = document.getElementById('todo-input') as HTMLInputElement;
        this.list = document.getElementById('todo-list') as HTMLUListElement;
        this.completeList = document.getElementById('complete-list') as HTMLUListElement;
        this.clearButton = document.getElementById('clear-button') as HTMLButtonElement;

        // フォームの送信イベントをリッスン
        this.form.addEventListener('submit', this.addTask.bind(this));

        // タスククリアボタンのクリックイベントをリッスン
        this.clearButton.addEventListener('click', this.clearList.bind(this));

        // ローカルストレージからタスクを復元
        this.loadTasks();
    }

    // タスクを追加
    private addTask(event: Event) {
        event.preventDefault();

        const taskText = this.input.value.trim();
        if (taskText === '') return;

        const newId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
        const newTask = new ToDoItem(newId, taskText, false);
        this.items.push(newTask);
        this.saveTasks();
        this.displayTasks();
        this.input.value = '';
    }


    // タスクの完了状態をトグルするメソッド
    private toggleTaskCompletion(task: ToDoItem) {
        task.completed = !task.completed;
        this.saveTasks();
        this.displayTasks();
    }

    // タスクを表示
    private displayTasks() {
        //Display Tasks
        this.list.innerHTML = '';
        this.items.forEach((task) => {
            if(!task.completed){
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class='list-content'>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} id=todo-${task.id}>
                    <span><strong>${task.text}</strong></span>
                    </div>
                    <button class="delete-button">Delete</button>
                `;

                const deleteButton = listItem.querySelector('.delete-button') as HTMLButtonElement;
                deleteButton.addEventListener('click', () => this.deleteTask(task));

                // チェックボックスの変更イベントをリッスンし、完了状態をトグル
                const checkbox = listItem.querySelector(`#todo-${task.id}`) as HTMLInputElement;
                checkbox.addEventListener('change', () => this.toggleTaskCompletion(task));


                this.list.appendChild(listItem);
            }
        });

        //Completed Tasks
        this.completeList.innerHTML = '';
        this.items.forEach((task) => {
            if(task.completed){
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class='list-content'>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} id=todo-${task.id}>
                    <span><del><strong>${task.text}</strong></del></span>
                    </div>
                    <button class="delete-button">Delete</button>
                `;

                const deleteButton = listItem.querySelector('.delete-button') as HTMLButtonElement;
                deleteButton.addEventListener('click', () => this.deleteTask(task));

                const checkbox = listItem.querySelector(`#todo-${task.id}`) as HTMLInputElement;
                checkbox.addEventListener('change', () => this.toggleTaskCompletion(task));

                this.completeList.appendChild(listItem);
            }
        });
    }

    // タスクを削除
    private deleteTask(task: ToDoItem) {
        const taskIndex = this.items.indexOf(task);
        if (taskIndex !== -1) {
            this.items.splice(taskIndex, 1);
            this.saveTasks();
            this.displayTasks();
        }
    }

    // タスクをクリア
    private clearList() {
        this.items = [];
        this.saveTasks();
        this.displayTasks();
    }

    // タスクをローカルストレージに保存
    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.items));
    }

    // タスクをローカルストレージから読み込み
    private loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.items = JSON.parse(savedTasks);
            this.displayTasks();
        }
    }
}

// ToDoリストのインスタンスを作成
const toDoList = new ToDoList();
