import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Link } from "react-router-dom";

const Navbar = ({ userName, userRole, onLogout, toggleSidebar }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 border-b border-border/40 bg-card/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <img
              src="/mainLogos/full_logobgr.png"
              alt="EduManage Logo"
              style={{
                height: "120px",
                width: "100px",
                objectFit: "contain",
                transform: "scale(1.2)",
                transition: "transform 0.3s ease",
                marginLeft: "5px",
              }}
              className="hover:scale-135"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-accent/50 transition-colors duration-200"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                <Avatar className="ring-2 ring-border/20">
                  <AvatarImage src="" alt={userName || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                    {userName
                      ? userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {userName || "User Name"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole || "role"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover/95 backdrop-blur-sm border-border/40"
            >
              <DropdownMenuLabel className="text-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />

              <DropdownMenuItem
                asChild
                className="hover:bg-accent/50 cursor-pointer"
              >
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="hover:bg-accent/50 cursor-pointer"
              >
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border/40" />

              <DropdownMenuItem
                onClick={onLogout}
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
