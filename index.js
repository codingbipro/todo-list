 class TodoApp {
            constructor() {
                this.tasks = [];
                this.taskIdCounter = 1;
                
                this.taskInput = document.getElementById('taskInput');
                this.addBtn = document.getElementById('addBtn');
                this.todoList = document.getElementById('todoList');
                this.totalTasks = document.getElementById('totalTasks');
                this.completedTasks = document.getElementById('completedTasks');
                this.remainingTasks = document.getElementById('remainingTasks');
                
                this.initEventListeners();
                this.updateStats();
            }

            initEventListeners() {
                this.addBtn.addEventListener('click', () => this.addTask());
                this.taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });
            }

            addTask() {
                const taskText = this.taskInput.value.trim();
                
                if (taskText === '') {
                    this.taskInput.style.borderColor = '#ff4757';
                    setTimeout(() => {
                        this.taskInput.style.borderColor = '#e0e0e0';
                    }, 1000);
                    return;
                }

                const task = {
                    id: this.taskIdCounter++,
                    text: taskText,
                    completed: false,
                    createdAt: new Date()
                };

                this.tasks.push(task);
                this.taskInput.value = '';
                this.renderTasks();
                this.updateStats();
            }

            deleteTask(taskId) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.renderTasks();
                this.updateStats();
            }

            toggleTask(taskId) {
                const task = this.tasks.find(task => task.id === taskId);
                if (task) {
                    task.completed = !task.completed;
                    this.renderTasks();
                    this.updateStats();
                }
            }

            renderTasks() {
                this.todoList.innerHTML = '';

                if (this.tasks.length === 0) {
                    this.todoList.innerHTML = `
                        <div class="empty-state">
                            No tasks yet. Add your first task above!
                        </div>
                    `;
                    return;
                }

                // Sort tasks: incomplete tasks first, then completed tasks
                const sortedTasks = [...this.tasks].sort((a, b) => {
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    return a.id - b.id; // Maintain original order within each group
                });

                sortedTasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
                    
                    li.innerHTML = `
                        <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})"></div>
                        <div class="task-content">
                            <span class="task-text">${this.escapeHtml(task.text)}</span>
                            <span class="task-time">Added: ${this.formatTime(task.createdAt)}</span>
                        </div>
                        <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})" title="Delete task">×</button>
                    `;
                    
                    this.todoList.appendChild(li);
                });
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(task => task.completed).length;
                const remaining = total - completed;

                this.totalTasks.textContent = total;
                this.completedTasks.textContent = completed;
                this.remainingTasks.textContent = remaining;
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            formatTime(date) {
                const now = new Date();
                const diff = now - date;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);

                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes} min ago`;
                if (hours < 24) return `${hours}h ago`;
                if (days < 7) return `${days}d ago`;
                
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
        }

        // Initialize the app
        const todoApp = new TodoApp();