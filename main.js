(function () {
    let tasksArray = loadtasksFromModel();

    if (tasksArray.length == 0) {
        console.log("Storage is empty");
    } else {
        showTasksUi(tasksArray);
    }

    let saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", onSaveClicked);
    
    let resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", onResetClicked);

    function loadtasksFromModel() {
        let strTaskArray = localStorage.getItem("task");
        let tasksArray;

        if (strTaskArray == null) {
            tasksArray = new Array();
        } else {
            tasksArray = JSON.parse(strTaskArray);
        }
        return tasksArray;

    }

    //This function displays the notes that exist in local storage
    function showTasksUi(tasksArray) {
        let container = document.getElementById("container");
        container.innerHTML = "";

        for (let index = 0; index < tasksArray.length; index++) {
            let note = createNoteUi(container);
            addTextToNoteUi(note, tasksArray[index]);
            addDateToNoteUi(note, tasksArray[index]);
            addXIconToNoteUi(note, tasksArray[index]);
        }
    }

    function createNoteUi(container) {
        let note = document.createElement("div");
        note.setAttribute("class", "taskArea");
        container.appendChild(note);
        return note;
    }

    function addTextToNoteUi(note, tasksArray) {
        let noteText = document.createElement("p");
        noteText.setAttribute("class", "textArea");
        noteText.innerHTML = tasksArray.taskDetails;
        note.appendChild(noteText);
    }

    function addDateToNoteUi(note, tasksArray) {
        let noteDate = document.createElement("span");
        noteDate.setAttribute("class", "spanDate");
        noteDate.innerHTML = tasksArray.dateOfTask + "<br>" + tasksArray.hourOfTask;
        note.appendChild(noteDate);
    }

    function addXIconToNoteUi(note, tasksArray) {
        let xIcon = document.createElement("span");
        xIcon.setAttribute("class", "glyphicon glyphicon-remove");
        xIcon.addEventListener("click", onRemoveTask);
        xIcon.setAttribute("id", tasksArray.id);
        note.appendChild(xIcon);
    }

    function onSaveClicked() {
        let taskText = document.getElementById("taskDetails");
        let dateOfTask = document.getElementById("dateOfTask");
        let hourOfTask = document.getElementById("hourOfTask");


        if (!checkIfFilledFields(taskText, dateOfTask, hourOfTask)) {
            return;
        }


        let isValidDate = calcValidDate(taskText, dateOfTask, hourOfTask);
        if (!isValidDate) {
            alert("Due time is in the past, Try again");
            return;
        }

        let task = gatherTaskDetails(taskText.value, dateOfTask.value, hourOfTask.value);

        let tasksArray = loadtasksFromModel();
        tasksArray.push(task);
        localStorage.setItem("task", JSON.stringify(tasksArray));
        addNoteToUi(task);
        onResetClicked();
    }

    function checkIfFilledFields(taskText, dateOfTask, hourOfTask) {
        taskText.style.border = "";
        dateOfTask.style.border = "";
        hourOfTask.style.border = "";

        if (taskText.value.trim() == "") {
            taskText.style.border = "3px solid #ce1919";
            alert("Missing Text!");
            return false;
        }
        if (dateOfTask.value == "") {
            dateOfTask.style.border = "3px solid #ce1919";
            alert("Missing Date!");
            return false;
        }
        return true;
    }

    function calcValidDate(taskText, dateOfTask, hourOfTask) {
        taskText.style.border = "";
        dateOfTask.style.border = "";
        hourOfTask.style.border = "";

        let taskDate = new Date(dateOfTask.value).setHours(0, 0, 0, 0);
        let today = new Date().setHours(0, 0, 0, 0);

        if (taskDate < today) {
            dateOfTask.style.border = "3px solid #ce1919";
            return false;
        }
        if (taskDate == today) {
            if (!isValidHour(hourOfTask.value) && hourOfTask.value != "") {
                hourOfTask.style.border = "3px solid #ce1919";
                return false;
            }
        }
        return true;
    }

    function isValidHour(hourOfTask) {
        let today = new Date();
        let currentTime = today.toLocaleTimeString("en-GB");
        
        if (hourOfTask < currentTime) {
            return false;
        }
        return true;
    }

    function gatherTaskDetails(taskText, dateOfTask, hourOfTask) {
        let task = {
            id: createValidId(),
            taskDetails: taskText,
            dateOfTask: reverseDate(dateOfTask),
            hourOfTask: hourOfTask
        }
        return task;
    }

    function createValidId() {
        let tasksArray = loadtasksFromModel();
        let idIndex = 0;

        if (tasksArray != "") {
            let currentId = tasksArray[tasksArray.length - 1].id;
            idIndex = currentId + 1;
        }
        return idIndex;
    }

    //This function receives a value which is a date and turns it over
    function reverseDate(dateOfTask) {
        let splitString = dateOfTask.split("-");
        let year = splitString[0];
        let month = splitString[1];
        let day = splitString[2];
        let reversedDate = day + "/" + month + "/" + year;
        return reversedDate;
      }
      
    //This function create a new note and adding it to UI
    function addNoteToUi(task) {
        let container = document.getElementById("container");
        let note = createNoteUi(container);

        addTextToNoteUi(note, task);
        addDateToNoteUi(note, task);
        addXIconToNoteUi(note, task);
    }

    function onResetClicked() {
        let taskText = document.getElementById("taskDetails");
        let dateOfTask = document.getElementById("dateOfTask");
        let hourOfTask = document.getElementById("hourOfTask");

        taskText.style.border = "";
        dateOfTask.style.border = "";
        hourOfTask.style.border = "";

        if(taskText.value == "" && dateOfTask.value == "" && hourOfTask.value == ""){
            alert("Fields already empty");
            return;
        }

        taskText.value = "";
        dateOfTask.value = "";
        hourOfTask.value = "";
    }


    function onRemoveTask() {
        this.parentNode.remove();

        let tasksArray = loadtasksFromModel();
        let currentId = this.id;

        removeTaskFromModel(tasksArray, currentId); 
        
    }
    
    function removeTaskFromModel(tasksArray, currentId) {
        for (let index = 0; index < tasksArray.length; index++) {
            if (tasksArray[index].id == currentId) {
                tasksArray.splice(index, 1);
            }
        }

        localStorage.setItem("task", JSON.stringify(tasksArray));
    
        clearStorageIfModelEmpty(tasksArray);
    }

    function clearStorageIfModelEmpty(tasksArray) {
        if (tasksArray.length == 0) {
            localStorage.clear();
        }
    }

})();

