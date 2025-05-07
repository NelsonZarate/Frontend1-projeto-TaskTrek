export const getTasks = async function fetchTasks() {
    try {
        const apiUrl = "https://681901c65a4b07b9d1d1a8e7.mockapi.io/tasks"; 
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

export const getTask = async function fetchTask(id) {
    try {
        const apiUrl = `https://681901c65a4b07b9d1d1a8e7.mockapi.io/tasks/${id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }
        const task = await response.json(); 
        return task;
    } catch (error) {
        console.error("Error fetching post:", error);
    }   
}

export const createTask = async function createNewTask(task) {
    try {
        console.log("Creating task:", task);
        const apiUrl = "https://681901c65a4b07b9d1d1a8e7.mockapi.io/tasks";
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.statusText}`);
        }
        const newTask = await response.json(); 
        return newTask;
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

export const updateTask = async function updateExistingTasks(id, task) {
    try {
        const apiUrl = `https://681901c65a4b07b9d1d1a8e7.mockapi.io/tasks/${id}`;
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`Failed to update post: ${response.statusText}`);
        }
        const updatedTask = await response.json();
        return updatedTask;
    } catch (error) {
        console.error("Error updating post:", error);
    }
};

export const deleteTask = async function deleteExistingTask(id) {
    try {
        const apiUrl = `https://681901c65a4b07b9d1d1a8e7.mockapi.io/tasks/${id}`; 
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete post: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};

