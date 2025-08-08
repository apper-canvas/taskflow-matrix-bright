import mockTasks from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
    this.nextId = Math.max(...this.tasks.map(t => t.Id)) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return this.tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    }));
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    
    return {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    };
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      Id: this.nextId++,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || "medium",
      category: taskData.category,
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.unshift(newTask);
    
    return {
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      createdAt: new Date(newTask.createdAt),
      completedAt: null
    };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates,
      dueDate: updates.dueDate ? updates.dueDate.toISOString() : this.tasks[index].dueDate,
      completedAt: updates.completedAt ? updates.completedAt.toISOString() : this.tasks[index].completedAt
    };
    
    this.tasks[index] = updatedTask;
    
    return {
      ...updatedTask,
      dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
      createdAt: new Date(updatedTask.createdAt),
      completedAt: updatedTask.completedAt ? new Date(updatedTask.completedAt) : null
    };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskService = new TaskService();