import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ProgressIndicator = ({ completed, total, todayCompleted, todayTotal }) => {
  const overallProgress = total > 0 ? (completed / total) * 100 : 0;
  const todayProgress = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" className="h-5 w-5 text-primary-600" />
            <h3 className="font-display font-semibold text-neutral-800">Overall Progress</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Tasks Completed</span>
              <span className="font-medium text-neutral-800">{completed} of {total}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary-600">{Math.round(overallProgress)}%</span>
            </div>
          </div>
        </div>
        
        {/* Today's Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="h-5 w-5 text-accent-600" />
            <h3 className="font-display font-semibold text-neutral-800">Today's Progress</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Tasks Completed</span>
              <span className="font-medium text-neutral-800">{todayCompleted} of {todayTotal}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${todayProgress}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-accent-600">{Math.round(todayProgress)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivational Message */}
      {todayProgress === 100 && todayTotal > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg border border-accent-200">
          <div className="flex items-center gap-2 text-accent-700">
            <ApperIcon name="PartyPopper" className="h-5 w-5" />
            <span className="font-medium">Great job! You've completed all your tasks for today! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;