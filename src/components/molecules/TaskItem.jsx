import React, { useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/molecules/TaskForm";
import { format, isToday, isBefore, startOfDay } from "date-fns";

const TaskItem = ({ 
  task, 
  categories,
  onToggleComplete, 
  onEdit, 
  onDelete,
  onSelect,
  isSelected = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const category = categories.find(cat => cat.Id === task.category);
  const isOverdue = task.dueDate && isBefore(new Date(task.dueDate), startOfDay(new Date())) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));
  
  const handleToggleComplete = async () => {
    setIsCompleting(true);
    await onToggleComplete(task.Id, !task.completed);
    setIsCompleting(false);
  };
  
  const handleEdit = async (formData) => {
    await onEdit(task.Id, formData);
    setIsEditing(false);
  };
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-blue-500";
      default: return "border-l-neutral-300";
    }
  };
  
  const getDueDateColor = () => {
    if (!task.dueDate) return "text-neutral-500";
    if (isOverdue) return "text-red-600";
    if (isDueToday) return "text-amber-600";
    return "text-neutral-600";
  };
  
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <TaskForm
          task={task}
          categories={categories}
          onSave={handleEdit}
          onCancel={() => setIsEditing(false)}
          isExpanded={true}
        />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      whileHover={{ y: -2 }}
      className={`
        group relative bg-white/60 backdrop-blur-sm border border-neutral-200/60 rounded-xl p-4 shadow-sm 
        hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${getPriorityColor()}
        ${task.completed ? "opacity-75" : ""}
        ${isSelected ? "ring-2 ring-primary-500 ring-opacity-50" : ""}
      `}
      onClick={() => onSelect && onSelect(task.Id)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className={isCompleting ? "opacity-50" : ""}
          />
        </div>
        
        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-grow">
              <h3 className={`
                font-medium text-neutral-900 break-words transition-all duration-200
                ${task.completed ? "line-through text-neutral-500" : ""}
              `}>
                {task.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {category && (
                  <Badge variant={category.name.toLowerCase()} size="sm">
                    {category.name}
                  </Badge>
                )}
                
                <Badge variant="default" size="sm">
                  <ApperIcon 
                    name={
                      task.priority === "high" ? "AlertTriangle" :
                      task.priority === "medium" ? "Minus" : "ArrowDown"
                    } 
                    className="h-3 w-3" 
                  />
                  {task.priority}
                </Badge>
                
                {task.dueDate && (
                  <div className={`flex items-center gap-1 text-xs ${getDueDateColor()}`}>
                    <ApperIcon name="Calendar" className="h-3 w-3" />
                    {isOverdue && <span className="font-medium">Overdue:</span>}
                    {isDueToday && !isOverdue && <span className="font-medium">Today:</span>}
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <ApperIcon name="Edit2" className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.Id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion Animation */}
      {isCompleting && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-accent-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="bg-accent-500 text-white p-3 rounded-full shadow-lg">
            <ApperIcon name="Check" className="h-6 w-6" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskItem;