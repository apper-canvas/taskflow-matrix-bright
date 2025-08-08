import React, { useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/molecules/TaskForm";
import ReactMarkdown from "react-markdown";
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
  
const category = categories.find(cat => cat.Id === task.category_c);
const isOverdue = task.due_date_c && isBefore(new Date(task.due_date_c), startOfDay(new Date())) && !task.completed_c;
  const isDueToday = task.due_date_c && isToday(new Date(task.due_date_c));
  
  const handleToggleComplete = async () => {
    setIsCompleting(true);
await onToggleComplete(task.Id, !task.completed_c);
    setIsCompleting(false);
  };
  
  const handleEdit = async (formData) => {
    await onEdit(task.Id, formData);
    setIsEditing(false);
  };
  
  const getPriorityColor = () => {
switch (task.priority_c) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-blue-500";
      case "urgent": return "border-l-red-600";
      default: return "border-l-neutral-300";
    }
  };
  
const getDueDateColor = () => {
    if (!task.due_date_c) return "text-neutral-500";
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
${task.completed_c ? "line-through text-neutral-500" : ""}
              `}>
{task.title_c}
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
                      task.priority_c === "high" ? "AlertTriangle" :
                      task.priority_c === "urgent" ? "AlertTriangle" :
                      task.priority_c === "medium" ? "Minus" : "ArrowDown"
                    } 
                    className="h-3 w-3" 
                  />
                  {task.priority_c}
                </Badge>
                
                {task.due_date_c && (
                  <div className={`flex items-center gap-1 text-xs ${getDueDateColor()}`}>
                    <ApperIcon name="Calendar" className="h-3 w-3" />
                    {isOverdue && <span className="font-medium">Overdue:</span>}
                    {isDueToday && !isOverdue && <span className="font-medium">Today:</span>}
                    {format(new Date(task.due_date_c), "MMM d, yyyy")}
                  </div>
                )}
                
                {task.notes_c && (
                  <Badge variant="outline" size="sm">
                    <ApperIcon name="FileText" className="h-3 w-3" />
                    Notes
                  </Badge>
                )}
              </div>
              
              {/* Notes Section */}
{task.notes_c && (
                <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({children}) => <h1 className="text-sm font-bold text-neutral-800 mb-1">{children}</h1>,
                        h2: ({children}) => <h2 className="text-sm font-semibold text-neutral-800 mb-1">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xs font-semibold text-neutral-700 mb-1">{children}</h3>,
                        p: ({children}) => <p className="text-xs text-neutral-600 mb-1 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-xs text-neutral-600 space-y-0.5 mb-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-0.5 mb-1">{children}</ol>,
                        li: ({children}) => <li className="ml-1">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-neutral-800">{children}</strong>,
                        em: ({children}) => <em className="italic text-neutral-700">{children}</em>,
                        code: ({children}) => <code className="bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                        pre: ({children}) => <pre className="bg-neutral-800 text-neutral-100 p-2 rounded text-xs font-mono overflow-x-auto mb-1">{children}</pre>,
                        blockquote: ({children}) => <blockquote className="border-l-2 border-neutral-300 pl-2 text-neutral-600 italic mb-1">{children}</blockquote>,
                        a: ({children, href}) => <a href={href} className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">{children}</a>
                      }}
                    >
                      {task.notes_c}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
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