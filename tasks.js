import { createTask, getTask, getTasks, deleteTask, updateTask } from "./app.js";
import { openEditModal } from "./modal.js";

document.addEventListener('DOMContentLoaded', () => {
    displayAllTasks();
    const clear_Button = document.getElementById("clear-completed-btn");
    clear_Button.style.display = "none";
    // Add event listener for the filter dropdown
    const filterSelect = document.getElementById("filter-select");
    filterSelect.addEventListener("change", (event) => {
        console.log("Filter changed:", event.target.value);
        const filterValue = event.target.value;
        if (filterValue === "completed"){
            clear_Button.style.display = "block";
        }
        else{
            clear_Button.style.display = "none";
        }
        displayAllTasks(filterValue); // Pass the selected filter value
    });
    clear_Button.addEventListener("click", () => {
        getTasks()
            .then((tasks) => {
                const completedTasks = tasks.filter((task) => task.completed);
                const deletePromises = completedTasks.map((task) => deleteTask(task.id));
                return Promise.all(deletePromises);
            })
            .then(() => {
                console.log("Completed tasks deleted successfully.");
                const tasks = loadTasks();
                const completedTasks = tasks.filter((task) => task.completed);
                const updatedTasks = tasks.filter((task) => !task.completed);
                saveTasks(updatedTasks);
                displayAllTasks(); 
                document.getElementById("filter-select").value = "all";
                clear_Button.style.display = "none"; 
                console.log("Completed tasks deleted from localStorage.");
            })
            .catch((error) => console.error("Error deleting completed tasks:", error));


    });
});

// Select the form element
const todoForm = document.getElementById("todo-form");

// Add a submit event listener to the form
todoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input value
    const taskInput = document.getElementById("todo-input");
    const taskText = taskInput.value.trim();
    const TaskDescription = document.getElementById("todo-description");

    if (taskText) {
        // Construct the task object
        const task = {
            createdAt: new Date().toISOString(),
            name: taskText,
            description: TaskDescription.value,
            completed: false,
            completedAt: null,
        };

        // Call the createTask function with the constructed task object
        createTask(task)
            .then((newTask) => {
                console.log("Task created:", newTask);
                saveTasks(); // Save tasks to local storage
                displayAllTasks(); // Refresh the task list
            })
            .catch((error) => console.error("Error creating task:", error));

        taskInput.value = ""; // Clear the input field after submission
        TaskDescription.value = ""; // Clear the description field after submission
        displayAllTasks();

    } else {
        console.log("Task cannot be empty!"); // Log a message if the input is empty
    }
});


function displayAllTasks(filter = "all") {
    try {
        getTasks()
            .then((tasks) => {
                console.log("Tasks loaded from server:", tasks);

                // Apply the filter
                const filteredTasks = tasks.filter((task) => {
                    if (filter === "completed") return task.completed;
                    if (filter === "active") return !task.completed;
                    return true; // Show all tasks for "all"
                });

                const taskList = document.getElementById("task-list");
                taskList.innerHTML = ""; // Clear the existing tasks

                filteredTasks.forEach((task) => {
                    const listItem = document.createElement("div");
                    listItem.className = "task-item";

                    // Create a styled checkbox for task completion
                    const checkboxWrapper = document.createElement("div");
                    checkboxWrapper.className = "checkbox-wrapper-36";
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `toggle-${task.id}`;
                    checkbox.checked = task.completed;
                    const checkboxLabel = document.createElement("label");
                    checkboxLabel.htmlFor = `toggle-${task.id}`;

                    checkboxWrapper.appendChild(checkbox);
                    checkboxWrapper.appendChild(checkboxLabel);
                    listItem.appendChild(checkboxWrapper);
                    const editButton = document.createElement("sl-button");
                    editButton.textContent = "Edit";
                    editButton.setAttribute("variant", "primary");
                    editButton.className = "edit-button";
                    
                    editButton.addEventListener("click", () => {
                        openEditModal
                    });
                    listItem.appendChild(editButton);
                    const deleteButton = document.createElement("sl-button");
                    deleteButton.textContent = "Delete";
                    deleteButton.setAttribute("variant", "danger");
                    deleteButton.className = "delete-button";
                    deleteButton.addEventListener("click", () => {
                        deleteTask(task.id)
                            .then(() => {
                                console.log(`Task ${task.id} deleted successfully.`);
                                saveTasks(); // Save tasks to localStorage whenever updated
                                displayAllTasks(filter); // Refresh the task list with the current filter
                            })
                            .catch((error) => console.error("Error deleting task:", error));
                    });
                    listItem.appendChild(deleteButton);
                    // Task name
                    const taskName = document.createElement("h3");
                    taskName.textContent = task.name;
                    listItem.appendChild(taskName);

                    // Task description
                    const taskDescription = document.createElement("p");
                    taskDescription.textContent = task.description;
                    listItem.appendChild(taskDescription);

                    // Task creation date
                    const taskDate = document.createElement("p");
                    taskDate.textContent = "Created At: " + new Date(task.createdAt).toLocaleString();
                    listItem.appendChild(taskDate);

                    // Task status
                    const taskStatus = document.createElement("p");
                    if (checkbox.checked) {
                        listItem.style.boxShadow = "0 2px 4px rgba(10, 228, 10, 0.88)";
                    } else {
                        listItem.style.boxShadow = "0 2px 4px rgba(255, 0, 0, 0.94)";
                    }
                    taskStatus.textContent = task.completed ? "Completed" : "Not Completed";
                    listItem.appendChild(taskStatus);

                    // Task completedAt
                    const taskCompletedAt = document.createElement("p");
                    taskCompletedAt.textContent = task.completedAt
                        ? "Completed at: " + new Date(task.completedAt).toLocaleString()
                        : "Completed at: Not Completed Yet";
                    listItem.appendChild(taskCompletedAt);

                    // Add event listener to handle task completion
                    checkbox.addEventListener("change", () => {
                        const updatedTask = {
                            ...task,
                            completed: checkbox.checked,
                            completedAt: checkbox.checked ? new Date().toISOString() : null,
                        };

                        updateTask(task.id, updatedTask)
                            .then(() => {
                                console.log(`Task ${task.id} updated successfully.`);
                                saveTasks(); // Save tasks to localStorage whenever updated
                                displayAllTasks(filter); // Refresh the task list with the current filter
                            })
                            .catch((error) => console.error("Error updating task:", error));
                    });

                    taskList.appendChild(listItem);
                });

                saveTasks(tasks);
            })
            .catch((error) => {
                console.error("Error loading tasks from server, trying to load from localStorage:", error);
                const tasksFromLocalStorage = loadTasks();
                displayAllLocalTasks(tasksFromLocalStorage);
            });
    } catch (error) {
        console.error("Error in displayTasks:", error);
    }
}

function saveTasks(tasks) {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
    }
}

function loadTasks() {
    try {
        const tasks = localStorage.getItem("tasks");
        if (tasks) {
            return JSON.parse(tasks);
        }
        return [];
    } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
        return [];
    }
}

function displayAllLocalTasks(tasks) {
    tasks.forEach((task) => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Clear the existing tasks

        tasks.forEach((task) => {
            const listItem = document.createElement("div");
            listItem.className = "task-item";
            // Create a styled checkbox for task completion
            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.className = "checkbox-wrapper-36";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `toggle-${task.id}`;
            checkbox.checked = task.completed;

            const checkboxLabel = document.createElement("label");
            checkboxLabel.htmlFor = `toggle-${task.id}`;

            // Append the checkbox and label to the wrapper
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(checkboxLabel);

            // Append the checkbox wrapper to the task item
            listItem.appendChild(checkboxWrapper);

            // Task name
            const taskName = document.createElement("h3");
            taskName.textContent = task.name;
            listItem.appendChild(taskName);

            // Task description
            const taskDescription = document.createElement("p");
            taskDescription.textContent = task.description;
            listItem.appendChild(taskDescription);

            // Task creation date
            const taskDate = document.createElement("p");
            taskDate.textContent = "Created At: " + new Date(task.createdAt).toLocaleString();
            listItem.appendChild(taskDate);

            // Task status
            const taskStatus = document.createElement("p");
            if (checkbox.checked) {
                listItem.style.boxShadow = "0 2px 4px rgba(10, 228, 10, 0.88)";
            } else {
                listItem.style.boxShadow = "0 2px 4px rgba(255, 0, 0, 0.94)";
            }
            taskStatus.textContent = task.completed ? "Completed" : "Not Completed";
            listItem.appendChild(taskStatus);

            // Task completedAt
            const taskCompletedAt = document.createElement("p");
            taskCompletedAt.textContent = task.completedAt
                ? new Date(task.completedAt).toLocaleString()
                : "Not Completed Yet";
            listItem.appendChild(taskCompletedAt);

            // Add event listener to handle task completion
            checkbox.addEventListener("change", () => {
                const updatedTask = {
                    ...task,
                    completed: checkbox.checked,
                    completedAt: checkbox.checked ? new Date().toISOString() : null,
                };

                updateTask(task.id, updatedTask)
                    .then(() => {
                        console.log(`Task ${task.id} updated successfully.`);
                        saveTasks(); // Save tasks to localStorage whenever updated
                        displayAllTasks(); // Refresh the task list
                    })
                    .catch((error) => console.error("Error updating task:", error));
            });

            taskList.appendChild(listItem);
        });
        // Salvar as tasks no localStorage sempre que elas forem carregadas com sucesso
        saveTasks(tasks);

    });
}
