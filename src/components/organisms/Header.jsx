import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressIndicator from "@/components/molecules/ProgressIndicator";

const Header = ({ stats }) => {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  
  const getMotivation = () => {
    if (stats.todayCompleted === 0 && stats.todayTotal > 0) {
      return "Ready to tackle your tasks?";
    }
    if (stats.todayProgress === 100 && stats.todayTotal > 0) {
      return "Amazing! You've completed everything today! 🎉";
    }
    if (stats.todayProgress > 70) {
      return "You're almost there! Keep going! 💪";
    }
    if (stats.todayProgress > 30) {
      return "Great progress so far today! 🚀";
    }
    return "Let's make today productive! ✨";
  };
  
  return (
    <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          {/* Logo and Greeting */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ApperIcon name="CheckSquare" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl lg:text-4xl">TaskFlow</h1>
              <p className="text-primary-100 font-medium">{getGreeting()}! {getMotivation()}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 justify-center">
                <ApperIcon name="CheckCircle2" className="h-5 w-5 text-accent-300" />
                <div>
                  <p className="text-2xl font-bold">{stats.todayCompleted}</p>
                  <p className="text-xs text-primary-200">Completed Today</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 justify-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-yellow-300" />
                <div>
                  <p className="text-2xl font-bold">{stats.todayTotal - stats.todayCompleted}</p>
                  <p className="text-xs text-primary-200">Remaining Today</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 justify-center">
                <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-300" />
                <div>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                  <p className="text-xs text-primary-200">Overdue</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 justify-center">
                <ApperIcon name="Target" className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(stats.todayProgress)}%</p>
                  <p className="text-xs text-primary-200">Today's Progress</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ProgressIndicator
          completed={stats.completed}
          total={stats.total}
          todayCompleted={stats.todayCompleted}
          todayTotal={stats.todayTotal}
        />
      </div>
    </div>
  );
};

export default Header;