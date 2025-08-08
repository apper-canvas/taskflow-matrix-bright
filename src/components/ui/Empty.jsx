import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet", 
  description = "Start by adding your first task to get organized!",
  actionLabel = "Add Your First Task",
  onAction,
  icon = "CheckSquare"
}) => {
  return (
    <div className="text-center py-16">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-lg mx-auto border border-neutral-200/60 shadow-sm">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-full w-fit mx-auto mb-6">
          <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
        </div>
        
        <h3 className="font-display font-semibold text-2xl text-neutral-800 mb-3">
          {title}
        </h3>
        
        <p className="text-neutral-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            size="lg"
            className="px-8"
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
            {actionLabel}
          </Button>
        )}
        
        {/* Motivational Tips */}
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="bg-accent-100 p-2 rounded-lg w-fit mx-auto">
                <ApperIcon name="Target" className="h-4 w-4 text-accent-600" />
              </div>
              <div className="text-xs text-neutral-600">
                <p className="font-medium">Set Goals</p>
                <p>Break big projects into smaller tasks</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-blue-100 p-2 rounded-lg w-fit mx-auto">
                <ApperIcon name="Clock" className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-xs text-neutral-600">
                <p className="font-medium">Set Deadlines</p>
                <p>Stay on track with due dates</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-yellow-100 p-2 rounded-lg w-fit mx-auto">
                <ApperIcon name="Star" className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="text-xs text-neutral-600">
                <p className="font-medium">Prioritize</p>
                <p>Focus on what matters most</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;