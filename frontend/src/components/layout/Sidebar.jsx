import { NavLink, useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenuItems } from "@/config/menuItems";

const Sidebar = ({ role, onLogout, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const links = getMenuItems(role);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header Section - Fixed height */}
      <div className="border-b border-sidebar-border/50 h-20 flex items-center">
        <div className="flex items-center justify-between w-full px-4">
          {isOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <img
                    src="/mainLogos/onlylogobgr.png"
                    alt="Studify Logo"
                    style={{
                      height: "40px",
                      width: "40px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={toggleSidebar}
                className="group rounded-lg p-2 transition-all duration-200 hover:bg-sidebar-accent/50 hover:shadow-sm"
                title="Collapse sidebar"
              >
                <Menu className="h-4 w-4 text-sidebar-foreground/70 transition-transform group-hover:scale-110 group-hover:text-sidebar-foreground" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="group mx-auto rounded-lg p-2 transition-all duration-200 hover:bg-sidebar-accent/50 hover:shadow-sm"
              title="Expand sidebar"
            >
              <Menu className="h-4 w-4 text-sidebar-foreground/70 transition-transform group-hover:scale-110 group-hover:text-sidebar-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-1 flex-col overflow-hidden p-3">
        <div className="space-y-1 overflow-hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "group relative flex items-center rounded-lg px-2 py-3 transition-all duration-200",
                  isOpen ? "justify-start gap-3" : "justify-center",
                  isActive
                    ? "scale-[1.02] transform bg-primary font-semibold text-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:shadow-sm"
                )}
                title={!isOpen ? link.label : undefined}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-md transition-all duration-200",
                    isOpen ? "h-8 w-8" : "h-9 w-9",
                    isActive
                      ? "bg-primary-foreground/20 shadow-inner"
                      : "group-hover:bg-sidebar-accent/30 group-hover:shadow-inner"
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all duration-200",
                      isOpen ? "h-4 w-4" : "h-5 w-5",
                      isActive && "scale-110"
                    )}
                  />
                </div>

                {isOpen && (
                  <span className="truncate text-sm font-medium transition-all duration-200">
                    {link.label}
                  </span>
                )}

                {isActive && isOpen && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground/90 shadow-sm" />
                )}

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 z-50 hidden rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                    {link.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="border-t border-sidebar-border/50 p-3">
        <button
          onClick={onLogout}
          className={cn(
            "group flex w-full items-center rounded-lg px-3 py-3 text-sidebar-foreground/80 transition-all duration-200 hover:bg-destructive/15 hover:text-destructive hover:shadow-sm",
            isOpen ? "gap-3" : "justify-center"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 group-hover:bg-destructive/20 group-hover:shadow-inner">
            <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
          </div>
          {isOpen && <span className="text-sm font-medium">Logout</span>}

          {/* Tooltip for collapsed state */}
          {!isOpen && (
            <div className="absolute left-full ml-2 z-50 hidden rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
