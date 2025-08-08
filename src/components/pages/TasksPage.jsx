import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/molecules/TaskForm";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { isToday, isBefore, startOfDay } from "date-fns";

const TasksPage = ({ filter: routeFilter }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  
  // Data state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && task.category !== selectedCategory) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    
    // Completion filter
    if (!showCompleted && task.completed) {
      return false;
    }
    
    // Route-based filters
    if (routeFilter === "today" && task.dueDate) {
      return isToday(new Date(task.dueDate));
    }
    
    if (routeFilter === "overdue" && task.dueDate) {
      return isBefore(new Date(task.dueDate), startOfDay(new Date())) && !task.completed;
    }
    
    if (location.pathname === "/today" && task.dueDate) {
      return isToday(new Date(task.dueDate));
    }
    
    if (location.pathname === "/overdue" && task.dueDate) {
      return isBefore(new Date(task.dueDate), startOfDay(new Date())) && !task.completed;
    }
    
    return true;
  });
  
  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    todayTotal: tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate))).length,
    todayCompleted: tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)) && task.completed).length,
    overdue: tasks.filter(task => task.dueDate && isBefore(new Date(task.dueDate), startOfDay(new Date())) && !task.completed).length,
    todayProgress: 0
  };
  
  if (stats.todayTotal > 0) {
    stats.todayProgress = (stats.todayCompleted / stats.todayTotal) * 100;
  }
  
  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      });
      
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task added successfully! 🎉");
      setShowAddForm(false);
    } catch (err) {
      toast.error("Failed to add task");
      console.error("Error adding task:", err);
    }
  };
  
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        completed,
        completedAt: completed ? new Date() : null
      });
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      toast.success(completed ? "Task completed! Great job! 🎉" : "Task reopened");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };
  
  const handleEditTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData);
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      toast.success("Task updated successfully! 📝");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };
  
  const handleBulkDelete = async (taskIds) => {
    if (!window.confirm(`Are you sure you want to delete ${taskIds.length} tasks?`)) return;
    
    try {
      await Promise.all(taskIds.map(id => taskService.delete(id)));
      setTasks(prev => prev.filter(task => !taskIds.includes(task.Id)));
      toast.success(`${taskIds.length} tasks deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete tasks");
      console.error("Error deleting tasks:", err);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="min-h-screen">
      <Header stats={stats} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search and Add Task */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search your tasks..."
              className="w-full"
            />
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="lg"
            className="lg:min-w-[160px]"
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
            {showAddForm ? "Hide Form" : "Add Task"}
          </Button>
        </div>
        
        {/* Add Task Form */}
        {showAddForm && (
          <TaskForm
            categories={categories}
            onSave={handleAddTask}
            onCancel={() => setShowAddForm(false)}
            isExpanded={true}
          />
        )}
        
        {/* Filters */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          showCompleted={showCompleted}
          onShowCompletedChange={setShowCompleted}
        />
        
        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onBulkDelete={handleBulkDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TasksPage;