import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskForm = ({ 
  task = null, 
  categories, 
  onSave, 
  onCancel,
  isExpanded = false
}) => {
const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    category: "",
    dueDate: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        notes: task.notes || ""
      });
    } else {
      setFormData({
        title: "",
        priority: "medium",
        category: categories[0]?.Id || "",
        dueDate: "",
        notes: ""
      });
    }
  }, [task, categories]);
  
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      });
      
      if (!task) {
        setFormData({
          title: "",
          priority: "medium",
          category: categories[0]?.Id || "",
          dueDate: "",
          notes: ""
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuickAdd = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const getQuickDateOptions = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      { label: "Today", value: format(today, "yyyy-MM-dd") },
      { label: "Tomorrow", value: format(tomorrow, "yyyy-MM-dd") },
      { label: "Next Week", value: format(nextWeek, "yyyy-MM-dd") }
    ];
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-xl p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Task Title
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onKeyDown={handleQuickAdd}
            placeholder="What needs to be done?"
            className="text-base"
            autoFocus
          />
        </div>
        
{isExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                  Priority
                </label>
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            
            {/* Notes Section */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                Notes & Description
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add detailed notes, descriptions, or requirements for this task..."
                rows={4}
                showPreview={true}
              />
            </div>
            
            {/* Quick Date Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-neutral-500">Quick dates:</span>
              {getQuickDateOptions().map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, dueDate: option.value })}
                >
                  {option.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFormData({ ...formData, dueDate: "" })}
              >
                <ApperIcon name="X" className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!formData.title.trim() || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="h-4 w-4" />
                  {task ? "Update Task" : "Add Task"}
                </>
              )}
            </Button>
            
            {task && onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
          
          {!task && !isExpanded && (
            <div className="text-xs text-neutral-500">
              Press Enter to add quickly, or click for more options
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;