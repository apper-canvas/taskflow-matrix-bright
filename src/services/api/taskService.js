class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "category_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title_c: task.title_c || task.Name,
        completed_c: task.completed_c || false,
        priority_c: task.priority_c || "medium",
        category_c: task.category_c,
        due_date_c: task.due_date_c ? new Date(task.due_date_c) : null,
        created_at_c: task.created_at_c ? new Date(task.created_at_c) : new Date(),
        completed_at_c: task.completed_at_c ? new Date(task.completed_at_c) : null,
        notes_c: task.notes_c || ""
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "category_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Task not found");
      }

      const task = response.data;
      return {
        Id: task.Id,
        title_c: task.title_c || task.Name,
        completed_c: task.completed_c || false,
        priority_c: task.priority_c || "medium",
        category_c: task.category_c,
        due_date_c: task.due_date_c ? new Date(task.due_date_c) : null,
        created_at_c: task.created_at_c ? new Date(task.created_at_c) : new Date(),
        completed_at_c: task.completed_at_c ? new Date(task.completed_at_c) : null,
        notes_c: task.notes_c || ""
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title_c || taskData.title || "Untitled Task",
          title_c: taskData.title_c || taskData.title,
          completed_c: taskData.completed_c || false,
          priority_c: taskData.priority_c || taskData.priority || "medium",
          category_c: taskData.category_c || taskData.category,
          due_date_c: taskData.due_date_c ? taskData.due_date_c.toISOString().split('T')[0] : (taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null),
          created_at_c: new Date().toISOString(),
          completed_at_c: taskData.completed_c ? new Date().toISOString() : null,
          notes_c: taskData.notes_c || taskData.notes || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            Id: createdTask.Id,
            title_c: createdTask.title_c || createdTask.Name,
            completed_c: createdTask.completed_c || false,
            priority_c: createdTask.priority_c || "medium",
            category_c: createdTask.category_c,
            due_date_c: createdTask.due_date_c ? new Date(createdTask.due_date_c) : null,
            created_at_c: createdTask.created_at_c ? new Date(createdTask.created_at_c) : new Date(),
            completed_at_c: createdTask.completed_at_c ? new Date(createdTask.completed_at_c) : null,
            notes_c: createdTask.notes_c || ""
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (updates.title_c !== undefined || updates.title !== undefined) {
        updateData.title_c = updates.title_c || updates.title;
        updateData.Name = updates.title_c || updates.title;
      }
      if (updates.completed_c !== undefined || updates.completed !== undefined) {
        updateData.completed_c = updates.completed_c ?? updates.completed;
      }
      if (updates.priority_c !== undefined || updates.priority !== undefined) {
        updateData.priority_c = updates.priority_c || updates.priority;
      }
      if (updates.category_c !== undefined || updates.category !== undefined) {
        updateData.category_c = updates.category_c || updates.category;
      }
      if (updates.due_date_c !== undefined || updates.dueDate !== undefined) {
        const dueDate = updates.due_date_c || updates.dueDate;
        updateData.due_date_c = dueDate ? dueDate.toISOString().split('T')[0] : null;
      }
      if (updates.completed_at_c !== undefined || updates.completedAt !== undefined) {
        const completedAt = updates.completed_at_c || updates.completedAt;
        updateData.completed_at_c = completedAt ? completedAt.toISOString() : null;
      }
      if (updates.notes_c !== undefined || updates.notes !== undefined) {
        updateData.notes_c = updates.notes_c !== undefined ? updates.notes_c : updates.notes;
      }

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            title_c: updatedTask.title_c || updatedTask.Name,
            completed_c: updatedTask.completed_c || false,
            priority_c: updatedTask.priority_c || "medium",
            category_c: updatedTask.category_c,
            due_date_c: updatedTask.due_date_c ? new Date(updatedTask.due_date_c) : null,
            created_at_c: updatedTask.created_at_c ? new Date(updatedTask.created_at_c) : new Date(),
            completed_at_c: updatedTask.completed_at_c ? new Date(updatedTask.completed_at_c) : null,
            notes_c: updatedTask.notes_c || ""
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      throw error;
    }
  }
}

export const taskService = new TaskService();