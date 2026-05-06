// layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Your logout logic here
    console.log("Logging out...");
    // Example: clear localStorage, redirect to login, etc.
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 z-30 h-screen">
        <Sidebar
          role="admin" // or get from context/state
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-0 z-20 transition-all duration-300 ease-in-out">
          <Navbar
            userName="John Doe" // or get from context/state
            userRole="admin"
            onLogout={handleLogout}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto pt-16">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
