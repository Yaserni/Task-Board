loadTasks()
function getTasks() {
    const jsonArray = localStorage.getItem("tasks");
    if (jsonArray) {
        tasks = JSON.parse(jsonArray);
        return tasks;
    }
    tasks = [];
    return tasks;
}
function loadTasks() {
    let tasks = [];
    let taskId = localStorage.getItem("taskId");
    if (!taskId) {
        localStorage.setItem("taskId", "0");
    }
    const jsonArray = localStorage.getItem("tasks");
    if (jsonArray) {
        tasks = JSON.parse(jsonArray);
        attacheTasks(tasks);
    }
}
function checkDate(date, hour) {
    let newDate = new Date(date);
    if (hour !== "") {
        let h = hour.split(":")
        newDate.setHours(h[0]);
        newDate.setMinutes(h[1]);
    }

    let today = new Date(Date.now());

    if (newDate.getTime() > today.getTime()) return true;
    return false;
}

function createTask(content, expirationDate, taskhour) {// createTask is a function that takes as a variables three elements and build the task 
    const taskId = +localStorage.getItem("taskId");
    if (taskhour === undefined) {
        taskhour = null;
    }
    let task = {
        description: content,
        expiration: expirationDate,
        hour: taskhour,
        taskid: taskId
    };
    return task;
}
function clearInputs() {// clearInputs is a function that clean the input we replace it with a reset button 
    document.getElementById("taskContent").value = '';
    document.getElementById("taskDate").value = '';
    document.getElementById("taskHour").value = '';
    document.getElementById("hourError").innerHTML = '';
    document.getElementById("contentError").innerHTML = '';
    document.getElementById("dateError").innerHTML = '';
}

function saveTask() {
    // clean the error span messages 
    document.getElementById("contentError").innerText = "";
    document.getElementById("dateError").innerText = "";
    document.getElementById("hourError").innerText = "";
    let taskId = +localStorage.getItem("taskId");
    let tasks = getTasks();
    const taskDate = document.getElementById("taskDate").value;
    const taskHour = document.getElementById("taskHour").value;

    if (validation(taskDate, taskHour)) {
        const taskContent = document.getElementById("taskContent").value;
        const task = createTask(taskContent, taskDate, taskHour);
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        addTaskToBoard(task);
        taskId++;
        localStorage.setItem("taskId", taskId);
        clearInputs();
    }
}

function emptyValidation(str) {
    return (str === "") ? true : false;
}

function validation(taskDate, taskHour) {
    let flag = 0; // flag give us indication if the date invalid or the content is empty

    let taskContent = document.getElementById("taskContent").value;
    if (emptyValidation(taskContent)) {
        document.getElementById("contentError").innerText = "missing content";
        flag++;
    }
    let date = document.getElementById("taskDate").value;
    if (date === "") {
        document.getElementById("dateError").innerText = "missing date";
        flag++;
    }

    else if (!checkDate(taskDate, taskHour)) {
        document.getElementById("dateError").innerText = "The time you entered has passed";
        flag++;
    }
    let taskhour = document.getElementById("taskHour").value;
    if (!emptyValidation(taskhour)) {
        if (!validateHour(taskhour)) {
            document.getElementById("hourError").innerHTML = "invalid hour";
            flag++;
        }

    }
    return flag ? false : true;
}


function validateHour(hour) {
    let hourRPattern = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])$/;
    return hourRPattern.test(hour);
}

// attachetask is a function that add all the tasks from the array tasks to the board (UI) at the first when we enter to the site 
function attacheTasks(tasks) {
    let finishedTasks = "";
    let tasks2 = [];
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!checkDate(task.expiration, task.hour)) {
            finishedTasks += "\nTask content: " + task.description;
        }
        else {
            addTaskToBoard(task);
            tasks2.push(task);
        }


    }
    localStorage.setItem("tasks", JSON.stringify(tasks2));

    if (finishedTasks)
        alert("the time of this task has been passed:" + finishedTasks);
}

function displayRemoveButton(divTask) {
    let deleteId = divTask.getAttribute('data-deletid');
    let deleteButton = document.getElementById("delButton" + deleteId);
    deleteButton.style.visibility = "visible";

}

function hideRemoveButton(divTask) {
    let deleteId = divTask.getAttribute('data-deletid');
    let deleteButton = document.getElementById("delButton" + deleteId);
    deleteButton.style.visibility = "hidden";
}

function deleteTask(deleteButton) {
    let tasks = getTasks();
    let deleteId = deleteButton.getAttribute('data-deletid');
    for (let i = 0; i < tasks.length; i++) {
        if (+tasks[i].taskid === +deleteId) {
            tasks.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    let divTask = document.getElementById("task" + deleteId);
    document.getElementById("tasksSection").removeChild(divTask);
}

// Create Div Task
function createDivTask(id) {
    let divTask = document.createElement("div");
    divTask.setAttribute("class", "noteDisplay");
    divTask.setAttribute("id", "task" + id);
    divTask.setAttribute('data-deletid', id);
    divTask.setAttribute("onmouseover", "displayRemoveButton(this)");
    divTask.setAttribute("onmouseout", "hideRemoveButton(this)");
    return divTask;
}

function createDeleteButton(id) {
    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('data-deletid', id);
    deleteButton.setAttribute('class', "glyphicon glyphicon-remove deleteButton");
    deleteButton.setAttribute("id", "delButton" + id);
    deleteButton.setAttribute("onclick", "deleteTask(this)");
    return deleteButton;
}

function createTextArea(taskDescription) {
    let texareaTaskContent = document.createElement("textarea");
    texareaTaskContent.setAttribute("class", "insideNote");
    texareaTaskContent.setAttribute("disabled", "true");
    texareaTaskContent.innerText = taskDescription;
    return texareaTaskContent;
}

function createHourSpan(hour) {
    let taskhour = document.createElement("span");
    taskhour.setAttribute("class", "NoteTime");
    taskhour.innerText = hour;
    return taskhour;
}

function createDateSpan(date) {
    let taskdate = document.createElement("span");
    taskdate.setAttribute("class", "NoteTime");
    taskdate.innerText = date + "\n";
    return taskdate;
}

function addTaskToBoard(task) {
    let divTask = createDivTask(task.taskid);

    // adding the delete button
    let deleteButton = createDeleteButton(task.taskid);
    divTask.appendChild(deleteButton);

    // adding the textarea (the plain text for task)
    let texareaTaskContent = createTextArea(task.description);
    divTask.appendChild(texareaTaskContent);

    // adding the span that display the date  
    let notedate = createDateSpan(task.expiration);
    divTask.appendChild(notedate);

    // adding the span that display the hour 
    let notehour = createHourSpan(task.hour);
    divTask.appendChild(notehour);

    // adding the texareaTaskContent to the taskSection
    document.getElementById("tasksSection").appendChild(divTask);
}
