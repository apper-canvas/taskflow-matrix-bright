import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {children}
    </div>
  );
};

export default Layout;