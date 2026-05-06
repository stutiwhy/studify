import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [userName, setUserName] = useState("Admin User");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    if (role && name) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="edu-manage-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isAuthenticated ? (
              <div className="flex h-screen bg-background overflow-hidden">
                {/* Fixed Sidebar */}
                <div className="fixed left-0 top-0 z-30 h-screen">
                  <Sidebar
                    role={userRole}
                    onLogout={handleLogout}
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                </div>

                {/* Main Content Area */}
                <div
                  className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "ml-64" : "ml-16"
                  }`}
                >
                  {/* Fixed Navbar */}
                  <div
                    className="fixed top-0 z-20 w-full transition-all duration-300 ease-in-out"
                    style={{
                      left: sidebarOpen ? "16rem" : "4rem",
                      width: sidebarOpen
                        ? "calc(100% - 16rem)"
                        : "calc(100% - 4rem)",
                    }}
                  >
                    <Navbar
                      userName={userName}
                      userRole={userRole}
                      onLogout={handleLogout}
                      toggleSidebar={toggleSidebar}
                    />
                  </div>

                  {/* Scrollable Content */}
                  <main className="flex-1 overflow-auto pt-16">
                    <div className="p-6">
                      <AppRoutes />
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
