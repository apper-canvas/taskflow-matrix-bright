class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } }
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

      // Get task counts for each category
      const categoriesWithTaskCount = await Promise.all(
        response.data.map(async (category) => {
          const taskCountParams = {
            fields: [
              { field: { Name: "Id" } }
            ],
            where: [
              {
                FieldName: "category_c",
                Operator: "EqualTo",
                Values: [category.Id]
              }
            ]
          };

          try {
            const taskResponse = await this.apperClient.fetchRecords('task_c', taskCountParams);
            const taskCount = taskResponse.success ? (taskResponse.data?.length || 0) : 0;
            
            return {
              Id: category.Id,
              name: category.Name,
              color_c: category.color_c || "#3B82F6",
              taskCount
            };
          } catch (error) {
            return {
              Id: category.Id,
              name: category.Name,
              color_c: category.color_c || "#3B82F6",
              taskCount: 0
            };
          }
        })
      );

      return categoriesWithTaskCount;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Category not found");
      }

      const category = response.data;

      // Get task count for this category
      const taskCountParams = {
        fields: [
          { field: { Name: "Id" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category.Id]
          }
        ]
      };

      let taskCount = 0;
      try {
        const taskResponse = await this.apperClient.fetchRecords('task_c', taskCountParams);
        taskCount = taskResponse.success ? (taskResponse.data?.length || 0) : 0;
      } catch (error) {
        console.error("Error fetching task count:", error.message);
      }

      return {
        Id: category.Id,
        name: category.Name,
        color_c: category.color_c || "#3B82F6",
        taskCount
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
      }
      throw error;
    }
  }
}

export const categoryService = new CategoryService();