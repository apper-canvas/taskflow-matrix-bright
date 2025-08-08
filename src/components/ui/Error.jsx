import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="text-center space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-neutral-200/60 max-w-md">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="font-display font-semibold text-xl text-neutral-800 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-neutral-600 mb-6">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              variant="primary"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4" />
              Reload Page
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              If the problem persists, try refreshing the page or check your internet connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;