// Seleciona a modal e os elementos do formulário
const editTaskModal = document.getElementById("edit-task-modal");
const editTaskForm = document.getElementById("edit-task-form");
const editTaskName = document.getElementById("edit-task-name");
const editTaskDescription = document.getElementById("edit-task-description");

let currentTaskId = null; // Armazena o ID da tarefa sendo editada

// Função para abrir a modal e preencher os campos
export function openEditModal(task) {
  currentTaskId = task.id; // Armazena o ID da tarefa
  editTaskName.value = task.name; // Preenche o nome da tarefa
  editTaskDescription.value = task.description; // Preenche a descrição da tarefa
  editTaskModal.show(); // Abre a modal
}

// Evento para salvar as alterações
editTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedTask = {
    id: currentTaskId,
    name: editTaskName.value,
    description: editTaskDescription.value,
  };

  // Atualiza a tarefa (você pode substituir isso por uma chamada à API ou lógica existente)
  updateTask(updatedTask.id, updatedTask)
    .then(() => {
      console.log(`Task ${updatedTask.id} updated successfully.`);
      displayAllTasks(); // Atualiza a lista de tarefas
      editTaskModal.hide(); // Fecha a modal
    })
    .catch((error) => console.error("Error updating task:", error));
});

// Evento para fechar a modal ao clicar no botão "Cancel"
document.querySelector(".close-modal-btn").addEventListener("click", () => {
  editTaskModal.hide();
});