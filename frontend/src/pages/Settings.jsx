import { useState } from "react";
import {
  Bell,
  Palette,
  Moon,
  Sun,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx"; // Keeping Button for disabled state
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { toast } from "sonner"; // Keeping toast for the functional Dark Mode feedback

const Settings = () => {
  // Only functional state: Dark Mode, initialized based on current class
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));

  // The only functional handler left
  const toggleDarkMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    document.documentElement.classList.toggle("dark", newState);
    toast.info(`${newState ? "Dark" : "Light"} mode enabled.`, {
      description: "App theme updated successfully.",
    });
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-foreground">System Preferences</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage application appearance and security placeholders.
        </p>
      </header>
      
      {/* Settings Cards in a simple vertical stack */}
      <div className="space-y-6">

        {/* ---------------------------------- */}
        {/* 1. APPEARANCE CARD (Functional) */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg border-2 border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Palette className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Display & Appearance</CardTitle>
                <CardDescription>
                  Customize the visual theme of your dashboard.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card border rounded-xl transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-6 h-6 text-blue-500" />
                ) : (
                  <Sun className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <p className="font-bold text-lg">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between the light and dark application theme instantly.
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* ---------------------------------- */}
        {/* 2. NOTIFICATIONS CARD (Placeholder) */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg opacity-75">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Bell className="w-6 h-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-2xl">Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive alerts and system updates (Under Development).
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background border rounded-xl">
              <div>
                <p className="font-medium">Email Alerts Status</p>
                <p className="text-sm text-muted-foreground">
                  Receive system maintenance and grade posting notifications.
                </p>
              </div>
              <Switch disabled defaultChecked />
            </div>
            <Button disabled variant="outline" className="w-full mt-4">
                View Advanced Notification History
            </Button>
          </CardContent>
        </Card>
        
        {/* ---------------------------------- */}
        {/* 3. SECURITY CARD (Placeholder) */}
        {/* ---------------------------------- */}
        <Card className="shadow-lg opacity-75">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-2xl">Security & Access</CardTitle>
                <CardDescription>
                  Review account security settings (Under Development).
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background border rounded-xl">
              <div>
                <p className="font-medium">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch disabled />
            </div>
            <Button disabled variant="destructive" className="w-full mt-4">
                Manage Credentials
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
