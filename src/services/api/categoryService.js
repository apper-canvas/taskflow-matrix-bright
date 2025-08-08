import mockCategories from "@/services/mockData/categories.json";
import mockTasks from "@/services/mockData/tasks.json";

class CategoryService {
  constructor() {
    this.categories = [...mockCategories];
    this.tasks = [...mockTasks];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  }

  async getAll() {
    await this.delay();
    return this.categories.map(category => ({
      ...category,
      taskCount: this.tasks.filter(task => task.category === category.Id).length
    }));
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) throw new Error("Category not found");
    
    return {
      ...category,
      taskCount: this.tasks.filter(task => task.category === category.Id).length
    };
  }
}

export const categoryService = new CategoryService();