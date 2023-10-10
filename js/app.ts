// ToDoItem Class
class ToDoItem {
    constructor(public id: number, public text: string, public completed: boolean) {}
}

// ToDoList Class
class ToDoList {
    private items: ToDoItem[] = [];

    // get DOM element
    private form: HTMLFormElement;
    private input: HTMLInputElement;
    private list: HTMLUListElement;
    private completeList: HTMLUListElement;  
    private clearButton: HTMLButtonElement;

    constructor() {
        // set DOM element as property
        this.form = document.getElementById('todo-form') as HTMLFormElement;
        this.input = document.getElementById('todo-input') as HTMLInputElement;
        this.list = document.getElementById('todo-list') as HTMLUListElement;
        this.completeList = document.getElementById('complete-list') as HTMLUListElement;
        this.clearButton = document.getElementById('clear-button') as HTMLButtonElement;

        // listen form submit event
        this.form.addEventListener('submit', this.addTask.bind(this));

        // listen task clear button click event
        this.clearButton.addEventListener('click', this.clearList.bind(this));

        // get from localstorage
        this.loadTasks();
    }

    
    //add tasks method
    private addTask(event: Event) {
        event.preventDefault();

        //check form
        const taskText = this.input.value.trim();
        if (taskText === '') return;

        //set id
        const newId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
        //cretae new Task obj
        const newTask = new ToDoItem(newId, taskText, false);
        this.items.push(newTask);
        //save new data in localstorage
        this.saveTasks();
        //update Lists
        this.displayTasks();
        this.input.value = '';
    }


    // tasks completed toggle method
    private toggleTaskCompletion(task: ToDoItem) {
        task.completed = !task.completed;
        //save new data in localstorage
        this.saveTasks();
        this.displayTasks();
    }

    // display task method
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

                // change completed status by listening checkbox change event
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




    // delete task event
    private deleteTask(task: ToDoItem) {
        const taskIndex = this.items.indexOf(task);
        if (taskIndex !== -1) {
            this.items.splice(taskIndex, 1);
            this.saveTasks();
            this.displayTasks();
        }
    }

    // clear tasks
    private clearList() {
        this.items = [];
        this.saveTasks();
        this.displayTasks();
    }

    // save tasks in localstorage
    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.items));
    }

    // read tasks from localstorage
    private loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.items = JSON.parse(savedTasks);
            this.displayTasks();
        }
    }
}

// create ToDoList instance
const toDoList = new ToDoList();
