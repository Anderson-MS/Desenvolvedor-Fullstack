document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        if (taskName) {
            await addTask(taskName);
            taskInput.value = '';
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error('Erro ao buscar tarefas');
            }
            const tasks = await response.json();
            renderTaskList(tasks);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    function renderTaskList(tasks) {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.dataset.id = task.id; 
            taskItem.className = task.completed ? 'completed' : '';

            const taskName = document.createElement('span');
            taskName.textContent = task.name;
            taskName.classList.add('task-name');
            taskItem.appendChild(taskName);

            const actionButtons = document.createElement('div');
            actionButtons.classList.add('task-actions');

            const completeButton = document.createElement('button');
            completeButton.textContent = '✔️';
            completeButton.classList.add('complete');
            actionButtons.appendChild(completeButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.classList.add('delete');
            actionButtons.appendChild(deleteButton);

            taskItem.appendChild(actionButtons);
            taskList.appendChild(taskItem);
                 
            deleteButton.addEventListener('click', async () => {
                await deleteTask(task.id);
            });

            completeButton.addEventListener('click', async () => {
                await completeTask(task.id);
            });
        });
    }

    async function addTask(name) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        fetchTasks();
    }

    async function deleteTask(taskId) {
        //console.log('Tentando excluir a tarefa com ID:', taskId);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao excluir a tarefa.');
            }
            await fetchTasks();
        } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
            throw error;
        }
    }


    async function completeTask(taskId) {
        var id = taskId;
        const response = await fetch(`/api/tasks/${id}/complete/`, { method: 'PUT' });
        fetchTasks();
    }
    fetchTasks();
});

document.getElementById('taskInput').addEventListener('input', function (e) {
    // Remove números e caracteres especiais
    //this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});
