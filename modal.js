import { updateTask } from "./app.js";
import {displayAllTasks, displayAllLocalTasks} from "./tasks.js";

// Seleciona a modal e os elementos do formulário
const editTaskModal = document.getElementById("edit-task-modal");
const editTaskName = document.getElementById("edit-task-name");
const editTaskDescription = document.getElementById("edit-task-description");
const editTaskForm = document.getElementById("edit-task-form");

let currentTaskId = null; // Armazena o ID da tarefa sendo editada

// Função para abrir a modal e preencher os campos
export function openEditModal(task) {
  currentTaskId = task.id; // Armazena o ID da tarefa
  editTaskName.value = task.name; // Preenche o nome da tarefa
  editTaskDescription.value = task.description; // Preenche a descrição da tarefa
  editTaskModal.show(); // Abre a modal
}
editTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedTask = {
    id: currentTaskId,
    name: editTaskName.value,
    description: editTaskDescription.value,
  };

  updateTask(updatedTask.id, updatedTask)
    .then(() => {
      console.log(`Task ${updatedTask.id} updated successfully.`);
      displayAllTasks(); // Atualiza usando API
      editTaskModal.hide();
    })
    .catch((error) => {
      console.error("Error updating task via API:", error);

      const localTasks = loadTasks();
      const updatedLocalTasks = localTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );

      saveTasks(updatedLocalTasks);
      displayAllLocalTasks(updatedLocalTasks);
      editTaskModal.hide();
    });
});

document.querySelector(".close-modal-btn").addEventListener("click", () => {
  editTaskModal.hide();
});