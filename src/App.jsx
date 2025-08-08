import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import TasksPage from "@/components/pages/TasksPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
        <Layout>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/today" element={<TasksPage filter="today" />} />
            <Route path="/overdue" element={<TasksPage filter="overdue" />} />
            <Route path="/category/:categoryId" element={<TasksPage />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          style={{ zIndex: 9999 }}
          theme="light"
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
};

export default App;