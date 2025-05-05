import { createTask, getTask, getTasks, deleteTask, updateTask } from "./app.js";

document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
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
                displayTasks(); // Refresh the task list
            })
            .catch((error) => console.error("Error creating task:", error));

        taskInput.value = ""; // Clear the input field after submission
        TaskDescription.value = ""; // Clear the description field after submission
        displayTasks();

    } else {
        console.log("Task cannot be empty!"); // Log a message if the input is empty
    }
});

function displayTasks() {
    getTasks()
        .then((tasks) => {
            console.log("Tasks loaded:", tasks);
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
                if(checkbox.checked) {
                    listItem.style.boxShadow = "0 2px 4px rgba(10, 228, 10, 0.88)";
                }
                else {
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
                            displayTasks(); // Refresh the task list
                        })
                        .catch((error) => console.error("Error updating task:", error));
                });

                taskList.appendChild(listItem);
            });
        })
        .catch((error) => console.error("Error loading tasks:", error));
}

