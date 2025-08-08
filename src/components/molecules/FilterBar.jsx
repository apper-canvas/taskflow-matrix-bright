import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priority,
  onPriorityChange,
  showCompleted,
  onShowCompletedChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const filterOptions = [
    { key: "all", label: "All Tasks", path: "/" },
    { key: "today", label: "Today", path: "/today" },
    { key: "overdue", label: "Overdue", path: "/overdue" }
  ];
  
  const currentFilter = location.pathname === "/today" ? "today" 
                      : location.pathname === "/overdue" ? "overdue" 
                      : "all";
  
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/60 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              variant={currentFilter === option.key ? "primary" : "secondary"}
              size="sm"
              onClick={() => navigate(option.path)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-neutral-600">Categories:</span>
          <Badge
            variant={!selectedCategory ? "primary" : "default"}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onCategoryChange("")}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.Id}
              variant={selectedCategory === category.Id ? "primary" : category.name.toLowerCase()}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onCategoryChange(category.Id)}
            >
              {category.name} ({category.taskCount})
            </Badge>
          ))}
        </div>
        
        {/* Priority and Options */}
        <div className="flex gap-3 items-center lg:ml-auto">
          <div className="flex items-center gap-2">
            <ApperIcon name="Flag" className="h-4 w-4 text-neutral-500" />
            <Select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="min-w-[100px]"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          
          <Button
            variant={showCompleted ? "primary" : "ghost"}
            size="sm"
            onClick={() => onShowCompletedChange(!showCompleted)}
          >
            <ApperIcon name="Eye" className="h-4 w-4" />
            {showCompleted ? "Hide" : "Show"} Completed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;