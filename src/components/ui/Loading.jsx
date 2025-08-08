import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="text-center space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-neutral-200/60">
          <div className="animate-spin mx-auto mb-4">
            <ApperIcon name="Loader2" className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="font-display font-semibold text-xl text-neutral-800 mb-2">
            Loading TaskFlow
          </h2>
          <p className="text-neutral-600">
            Getting your tasks ready...
          </p>
          
          {/* Skeleton UI */}
          <div className="mt-8 space-y-3">
            <div className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;