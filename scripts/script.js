const inputField = document.getElementById("input-field")
const taskList = document.getElementById("task-list")
const addButton = document.getElementById("add-task")
const popup = document.getElementById("pop-up")
const confirmDelete = document.getElementById("delete-confirm")
const cancelDelete = document.getElementById("delete-cancel")
const selectedDate = document.querySelector('input[type="datetime-local"]');
const sortIcon = document.getElementById("sort")
const recentlyAddedSort = document.getElementById("recently-added")
const deadlineSort = document.getElementById("deadline")
const recentlyCompletedSort = document.getElementById("recently-completed")


// Load initial data
function getCurrentDate() {
    return new Date().toISOString();
}

function getListElement(task) {
    const taskContent = document.createElement("li");
    taskContent.innerHTML = task.description;
    taskContent.id = `${task.id}`;
    return taskContent;
}

function addDeleteButton(targetListElement) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    targetListElement.appendChild(deleteButton);
}

function addTimeLeft(taskData, listElement) {
    let timeLeftElement = document.createElement("div");
    let formatedDate = new Date(taskData.deadline)
    var diff = new Date(formatedDate) - new Date();
    diff = diff/1000;
    var seconds = Math.floor(diff % 60);
    diff = diff/60; 
    var minutes = Math.floor(diff % 60);
    diff = diff/60; 
    var hours = Math.floor(diff % 24);  
    var days = Math.floor(diff/24);
    timeLeftElement.innerHTML = "Time left: " + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
    listElement.appendChild(timeLeftElement);
}

function renderInitialTasks() {
    const initialTasks = JSON.parse(window.sessionStorage.getItem('tasks'));

    initialTasks.forEach(task => {
        const listElement = getListElement(task);
        addDeleteButton(listElement);
        addTimeLeft(task, listElement);
        taskList.appendChild(listElement);
    })
}

window.addEventListener('load', () => {
    renderInitialTasks();
})

// Task checked 
taskList.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        if (e.target.classList.contains('checked')) { 
            checkedElementID = e.target.id
            const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));
            const newTaskList = currentTasksInSessionStorage.map((task) => {
                if (task.id !== Number(checkedElementID)) {
                    return task;
                }
                return {...task, completedAt: new Date().toISOString()}
            })
            sessionStorage.setItem("tasks", JSON.stringify(newTaskList));
        } else {
            taskList.insertBefore(e.target, taskList.firstChild);
            checkedElementID = e.target.id
            const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));
            const newTaskList = currentTasksInSessionStorage.map((task) => {
                if (task.id !== Number(checkedElementID)) {
                    return task;
                }
                return {...task, completedAt: null}
            })
            sessionStorage.setItem("tasks", JSON.stringify(newTaskList));
        }
    } else if (e.target.tagName === "BUTTON") {
        const targetId = e.target.closest('li').id;
        popup.classList.add("open-pop-up");
        openDeleteModalId = targetId;
    }

}, false);


// For Date CountDown
const today = getCurrentDate();
let id = Object.keys(initialTasks).length +1;
let openDeleteModalId = null;

// Task added 
function addTask() {
    const now = getCurrentDate();
    const newTask = {};

    if (!inputField.value) {
        alert("You must fill task field")
        return;
    }
    else {
        newTask.id = id;
        newTask.description = inputField.value;
        newTask.createdAt = new Date().toISOString();
        newTask.selectedDate = selectedDate.value;
        newTask.deadline_ms = new Date(selectedDate.value) - new Date();
        newTask.deadline = new Date(selectedDate.value);
        newTask.completedAt = null;


        let taskContent = document.createElement("li");
        taskContent.innerHTML = inputField.value;
        taskContent.id = `${id}`;
        taskList.appendChild(taskContent);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        taskContent.appendChild(deleteButton);

        let datetime = document.createElement("div");
        let formatedDate = selectedDate.value
        var diff = new Date(formatedDate) - new Date();
        diff = diff/1000;
        var seconds = Math.floor(diff % 60);
        diff = diff/60; 
        var minutes = Math.floor(diff % 60);
        diff = diff/60; 
        var hours = Math.floor(diff % 24);  
        var days = Math.floor(diff/24);
        datetime.innerHTML = "Time left: " + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
        taskContent.appendChild(datetime);
    
    }

    inputField.value = "";
    ++id;

    const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));

    currentTasksInSessionStorage.push(newTask)
    window.sessionStorage.setItem('tasks', JSON.stringify(currentTasksInSessionStorage))
}

// Reset date and time after task submit
addButton.addEventListener('click', () => {
    selectedDate.value = "yyyy-MM-dd'T'hh:mm:ss.SS";
})


// Task deleted after popup confirmation
confirmDelete.addEventListener("click", function(e) {
    const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));

    filteredItems = currentTasksInSessionStorage.filter((task) =>  {
        return task.id !== Number(openDeleteModalId)
    })
    sessionStorage.setItem('tasks', JSON.stringify(filteredItems));
    document.getElementById(openDeleteModalId).remove();
    popup.classList.remove("open-pop-up")
});


// Pop up closed after popup cancel
cancelDelete.addEventListener("click", function(e) {
    popup.classList.remove("open-pop-up")
});

// Pop up closed after esc button
document.addEventListener('keyup', function(e) { 
    if(e.which == 27){
        popup.classList.remove("open-pop-up")
     }
})

// Pop up closed after click outside
document.addEventListener("mousedown", (event) => {
    if (!popup.contains(event.target)) {
        popup.classList.remove("open-pop-up")
    } 
});

// Sorting options appeared after filter icon clicked
sortIcon.addEventListener("click", function(e) {
    sortIcon.classList.toggle("opened");
});


// Sorting by recently added
recentlyAddedSort.addEventListener("click", function(e) {
    const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));
    const taskList = document.getElementById('task-list');

    currentTasksInSessionStorage.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt)
    });

    taskList.innerHTML = "";
    for (x in currentTasksInSessionStorage){
        let taskContent = document.createElement("li");
        taskContent.innerHTML = currentTasksInSessionStorage[x].description;
        taskContent.id = currentTasksInSessionStorage[x].id;
        taskList.appendChild(taskContent);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        taskContent.appendChild(deleteButton);

        let datetime = document.createElement("div");
        let formatedDate = currentTasksInSessionStorage[x].selectedDate
        var diff = new Date(formatedDate) - new Date();
        diff = diff/1000;
        var seconds = Math.floor(diff % 60);
        diff = diff/60; 
        var minutes = Math.floor(diff % 60);
        diff = diff/60; 
        var hours = Math.floor(diff % 24);  
        var days = Math.floor(diff/24);
        datetime.innerHTML = "Time left: " + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
        taskContent.appendChild(datetime);

        if (currentTasksInSessionStorage[x].completedAt !== null ) {
            taskContent.classList.add("checked")
        }
    }
});

// Sorting by deadline
deadlineSort.addEventListener("click", function(e) {
    const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));
    const taskList = document.getElementById('task-list');

    currentTasksInSessionStorage.sort(function(a,b){
        return new Date(a.deadline_ms) - new Date(b.deadline_ms) 
    });
    
    taskList.innerHTML = "";
    for (x in currentTasksInSessionStorage){
        let taskContent = document.createElement("li");
        taskContent.innerHTML = currentTasksInSessionStorage[x].description;
        taskContent.id = currentTasksInSessionStorage[x].id;
        taskList.appendChild(taskContent);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        taskContent.appendChild(deleteButton);

        let datetime = document.createElement("div");
        let formatedDate = currentTasksInSessionStorage[x].selectedDate
        var diff = new Date(formatedDate) - new Date();
        diff = diff/1000;
        var seconds = Math.floor(diff % 60);
        diff = diff/60; 
        var minutes = Math.floor(diff % 60);
        diff = diff/60; 
        var hours = Math.floor(diff % 24);  
        var days = Math.floor(diff/24);
        datetime.innerHTML = "Time left: " + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
        taskContent.appendChild(datetime);

        if (currentTasksInSessionStorage[x].completedAt !== null ) {
            taskContent.classList.add("checked")
        }
    }
});


// Sorting by completed items
recentlyCompletedSort.addEventListener("click", function(e) {
    const currentTasksInSessionStorage = JSON.parse(sessionStorage.getItem('tasks'));
    const taskList = document.getElementById('task-list');

    currentTasksInSessionStorage.sort(function(a,b){
        return new Date(b.completedAt)  - new Date(a.completedAt) 
    });
    
    taskList.innerHTML = "";
    for (x in currentTasksInSessionStorage){
        let taskContent = document.createElement("li");
        taskContent.innerHTML = currentTasksInSessionStorage[x].description;
        taskContent.id = currentTasksInSessionStorage[x].id;
        taskList.appendChild(taskContent);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        taskContent.appendChild(deleteButton);

        let datetime = document.createElement("div");
        let formatedDate = currentTasksInSessionStorage[x].selectedDate
        var diff = new Date(formatedDate) - new Date();
        diff = diff/1000;
        var seconds = Math.floor(diff % 60);
        diff = diff/60; 
        var minutes = Math.floor(diff % 60);
        diff = diff/60; 
        var hours = Math.floor(diff % 24);  
        var days = Math.floor(diff/24);
        datetime.innerHTML = "Time left: " + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
        taskContent.appendChild(datetime);

        if (currentTasksInSessionStorage[x].completedAt !== null) {
            taskContent.classList.add("checked")
        } 
    }
});


