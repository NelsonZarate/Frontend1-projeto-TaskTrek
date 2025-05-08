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
        if (filterValue === "completed") {
            clear_Button.style.display = "block";
        }
        else {
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
    const errorMessage = document.getElementById("error-message");

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
        errorMessage.textContent = ""; // Clear any previous error messages
        errorMessage.style.color = "green";
        errorMessage.textContent = "Task added successfully!";

    } else {
        errorMessage.textContent = "Please fill in at least the title of the task.";
        errorMessage.style.color = "red";
        console.log("Task cannot be empty!");
    }
});


export function displayAllTasks(filter = "all") {
    try {
        getTasks().then((tasks) => {
            console.log("Tasks loaded from server:", tasks);

            // Apply the filter
            const filteredTasks = tasks.filter((task) => {
                if (filter === "completed") return task.completed;
                if (filter === "active") return !task.completed;
                return true;
            });

            const taskList = document.getElementById("task-list");
            taskList.innerHTML = ""; // Clear existing cards

            filteredTasks.forEach((task) => {
                const cardCol = document.createElement("div");
                cardCol.className = "col-md-4"; // 3 cards per row on md+, full width on smaller

                const card = document.createElement("div");
                card.className = "card h-100 shadow-sm";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body d-flex flex-column";

                // Create a styled checkbox for task completion
                const checkboxWrapper = document.createElement("div");
                checkboxWrapper.className = "checkbox-wrapper-36";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `toggle-${task.id}`; // Corrected template literal syntax
                checkbox.checked = task.completed;

                const checkboxLabel = document.createElement("label");
                checkboxLabel.htmlFor = `toggle-${task.id}`; // Corrected template literal syntax

                checkboxWrapper.appendChild(checkbox);
                checkboxWrapper.appendChild(checkboxLabel); // Removed duplicate append

                const title = document.createElement("p");
                title.className = "card-title h5";
                title.textContent = task.name;

                const description = document.createElement("p");
                description.className = "card-text";
                description.textContent = task.description;

                const createdAt = document.createElement("p");
                createdAt.className = "text-muted small mb-1";
                createdAt.textContent = "Created: " + new Date(task.createdAt).toLocaleString();

                const statusBadge = document.createElement("span");
                statusBadge.className = task.completed ? "badge bg-success" : "badge bg-danger";
                statusBadge.textContent = task.completed ? "Completed" : "Not Completed";

                const completedAt = document.createElement("p");
                completedAt.className = "text-muted small";
                completedAt.textContent = task.completedAt
                    ? "Completed at: " + new Date(task.completedAt).toLocaleString()
                    : "Not completed yet";


                // Buttons
                const buttonGroup = document.createElement("div");
                buttonGroup.className = "mt-auto d-flex justify-content-between";

                const editBtn = document.createElement("button");
                editBtn.className = "btn btn-sm btn-primary bi bi-pencil-fill";
                editBtn.textContent = " Edit";
                editBtn.addEventListener("click", () => openEditModal(task));

                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn btn-sm btn-danger bi bi-trash-fill";
                deleteBtn.textContent = " Delete";
                deleteBtn.addEventListener("click", async(e) => {
                    e.stopPropagation();

                    const result = await Swal.fire({
                        title: "Do you want to delete this post?",
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                        denyButtonText: `Don't Delete`,
                        icon: 'warning'
                    });

                    if (result.isConfirmed) {
                        await deleteTask(task.id);
                        Swal.fire("Deleted!", "", "success");
                        console.log(`Task ${task.id} deleted successfully.`);
                        saveTasks();
                        displayAllTasks(filter);
                    } else if (result.isDenied) {
                        Swal.fire("Changes are not saved", "", "info");
                        console.error("Error deleting task:", error);
                    }
                });
                // Checkbox change logic
                checkbox.addEventListener("change", () => {
                    const updatedTask = {
                        ...task,
                        completed: checkbox.checked,
                        completedAt: checkbox.checked ? new Date().toISOString() : null,
                    };
                    updateTask(task.id, updatedTask)
                        .then(() => {
                            console.log(`Task ${task.id} updated.`);
                            saveTasks();
                            displayAllTasks(filter);
                        })
                        .catch((error) => console.error("Error updating task:", error));
                });

                // Assemble card
                cardBody.appendChild(checkboxWrapper);
                cardBody.appendChild(title);
                cardBody.appendChild(description);
                cardBody.appendChild(createdAt);
                cardBody.appendChild(statusBadge);
                cardBody.appendChild(completedAt);
                buttonGroup.appendChild(editBtn);
                buttonGroup.appendChild(deleteBtn);
                cardBody.appendChild(buttonGroup);
                card.appendChild(cardBody);
                cardCol.appendChild(card);
                taskList.appendChild(cardCol);
            });

            saveTasks(tasks); // Save after initial load/filter
        }).catch((error) => {
            console.error("Error loading tasks from API. Loading from localStorage...", error);
            const localTasks = loadTasks();
            displayAllLocalTasks(localTasks, filter);
        }
        );
    } catch (error) {
        console.error("Error loading tasks:", error);
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
export function displayAllLocalTasks(tasks, filter = "all") {
    try {
        // Filtra localmente igual à API
        const filteredTasks = tasks.filter((task) => {
            if (filter === "completed") return task.completed;
            if (filter === "active") return !task.completed;
            return true;
        });

        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Limpa os cards existentes

        filteredTasks.forEach((task) => {
            const cardCol = document.createElement("div");
            cardCol.className = "col-md-4";

            const card = document.createElement("div");
            card.className = "card h-100 shadow-sm";
            card.style.boxShadow = task.completed
                ? "0 2px 8px rgba(10, 228, 10, 0.88)"
                : "0 2px 8px rgba(255, 0, 0, 0.85)";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body d-flex flex-column";

            // Checkbox
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

            const title = document.createElement("p");
            title.className = "card-title h5";
            title.textContent = task.name;

            const description = document.createElement("p");
            description.className = "card-text";
            description.textContent = task.description;

            const createdAt = document.createElement("p");
            createdAt.className = "text-muted small mb-1";
            createdAt.textContent = "Created: " + new Date(task.createdAt).toLocaleString();

            const statusBadge = document.createElement("span");
            statusBadge.className = task.completed ? "badge bg-success" : "badge bg-danger";
            statusBadge.textContent = task.completed ? "Completed" : "Not Completed";

            const completedAt = document.createElement("p");
            completedAt.className = "text-muted small";
            completedAt.textContent = task.completedAt
                ? "Completed at: " + new Date(task.completedAt).toLocaleString()
                : "Not completed yet";

            const buttonGroup = document.createElement("div");
            buttonGroup.className = "mt-auto d-flex justify-content-between";

            const editBtn = document.createElement("button");
            editBtn.className = "btn btn-sm btn-primary";
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => openEditModal(task));

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                // Remove a task localmente
                const updatedTasks = tasks.filter(t => t.id !== task.id);
                saveTasks(updatedTasks);
                displayAllLocalTasks(updatedTasks, filter);
            });

            checkbox.addEventListener("change", () => {
                const updatedTask = {
                    ...task,
                    completed: checkbox.checked,
                    completedAt: checkbox.checked ? new Date().toISOString() : null,
                };

                // Atualiza a task na lista local
                const updatedTasks = tasks.map((t) =>
                    t.id === task.id ? updatedTask : t
                );
                saveTasks(updatedTasks);
                displayAllLocalTasks(updatedTasks, filter);
            });

            // Montagem do card
            cardBody.appendChild(checkboxWrapper);
            cardBody.appendChild(title);
            cardBody.appendChild(description);
            cardBody.appendChild(createdAt);
            cardBody.appendChild(statusBadge);
            cardBody.appendChild(completedAt);
            buttonGroup.appendChild(editBtn);
            buttonGroup.appendChild(deleteBtn);
            cardBody.appendChild(buttonGroup);
            card.appendChild(cardBody);
            cardCol.appendChild(card);
            taskList.appendChild(cardCol);
        });
    } catch (error) {
        console.error("Error displaying local tasks:", error);
    }
}

