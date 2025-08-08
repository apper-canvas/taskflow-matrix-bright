import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "@/components/molecules/TaskItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ 
  tasks, 
  categories,
  onToggleComplete, 
  onEdit, 
  onDelete,
  onBulkDelete,
  loading = false
}) => {
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  
  const handleSelectTask = (taskId) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };
  
  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
setSelectedTasks(new Set(tasks.map(task => task.Id)));
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    await onBulkDelete(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };
  
  const sortTasks = (tasks) => {
return [...tasks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "title":
          aValue = a.title_c.toLowerCase();
          bValue = b.title_c.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority_c] || 0;
          bValue = priorityOrder[b.priority_c] || 0;
          break;
        case "dueDate":
          aValue = a.due_date_c ? new Date(a.due_date_c).getTime() : Infinity;
          bValue = b.due_date_c ? new Date(b.due_date_c).getTime() : Infinity;
          break;
        case "created":
          aValue = new Date(a.created_at_c).getTime();
          bValue = new Date(b.created_at_c).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  };
  
  const sortedTasks = sortTasks(tasks);
  const completedTasks = sortedTasks.filter(task => task.completed);
  const incompleteTasks = sortedTasks.filter(task => !task.completed);
  
  const SortButton = ({ field, label }) => (
    <Button
      variant={sortBy === field ? "primary" : "ghost"}
      size="sm"
      onClick={() => {
        if (sortBy === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(field);
          setSortOrder("asc");
        }
      }}
    >
      {label}
      {sortBy === field && (
        <ApperIcon 
          name={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
          className="h-3 w-3" 
        />
      )}
    </Button>
  );
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/60 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-neutral-200 rounded"></div>
              <div className="flex-grow">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-3 bg-neutral-200 rounded w-16"></div>
                  <div className="h-3 bg-neutral-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-neutral-200/60">
          <ApperIcon name="CheckSquare" className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg text-neutral-700 mb-2">
            No tasks found
          </h3>
          <p className="text-neutral-500 mb-4">
            Start by adding your first task above. You've got this! 💪
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-600">Sort by:</span>
          <SortButton field="dueDate" label="Due Date" />
          <SortButton field="priority" label="Priority" />
          <SortButton field="title" label="Title" />
          <SortButton field="created" label="Created" />
        </div>
        
        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              <ApperIcon name="CheckSquare" className="h-4 w-4" />
              {selectedTasks.size === tasks.length ? "Deselect All" : "Select All"}
            </Button>
          )}
          
          {selectedTasks.size > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
              Delete Selected ({selectedTasks.size})
            </Button>
          )}
        </div>
      </div>
      
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg text-neutral-800 flex items-center gap-2">
            <ApperIcon name="Circle" className="h-5 w-5 text-primary-600" />
            Pending Tasks ({incompleteTasks.length})
          </h3>
          <AnimatePresence>
            {incompleteTasks.map((task) => (
              <TaskItem
key={task.Id}
                task={task}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.has(task.Id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg text-neutral-600 flex items-center gap-2">
            <ApperIcon name="CheckCircle2" className="h-5 w-5 text-accent-600" />
            Completed Tasks ({completedTasks.length})
          </h3>
          <AnimatePresence>
{completedTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.has(task.Id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;