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
            const taskList = document.getElementById('taskList');
            const tbody = taskList.querySelector('tbody');
            tbody.innerHTML = '';

            tasks.forEach((task, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${task.name}</td>
                <td>
                     <a href="#" class="complete" data-id="${task.id}" style="text-decoration:none" title="Completar Tarefa">✔️</a>
                    <a href="#" class="delete" data-id="${task.id}" style="text-decoration:none" title="Deletar Tarefa">❌</a>
                </td>
            `;

                if (task.completed) {
                    row.classList.add('completed');
                }

                tbody.appendChild(row);

         
                const completeButton = row.querySelector('.complete');
                completeButton.addEventListener('click', async () => {
                    await completeTask(task.id);
                    row.classList.toggle('completed'); 
                });

           
                const deleteButton = row.querySelector('.delete');
                deleteButton.addEventListener('click', async () => {
                    await deleteTask(task.id);
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

    document.getElementById('toggleTableBtn').addEventListener('click', function () {
        const taskForm = document.getElementById('taskForm');
        const taskList = document.getElementById('taskList');
        const toggleTableBtn = document.getElementById('toggleTableBtn');
     
        if (taskList.style.display === 'none') {
            taskList.style.display = 'table';
            taskForm.style.display = 'none';
            toggleTableBtn.textContent = 'Adicionar Tarefa';
        } else {
            taskList.style.display = 'none';
            taskForm.style.display = 'flex';
            toggleTableBtn.textContent = 'Listar Tarefas';
        }
    });

