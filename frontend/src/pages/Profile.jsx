import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Edit,
  GraduationCap,
  UserCheck,
  Camera,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { toast } from "sonner";

// Import real backend API functions
import { getUser, updateUser } from "@/utils/api";

// Define a safe initial state for the user object, EXCLUDING department and location
const initialUserState = {
  id: null,
  name: "Loading User...",
  email: "",
  phone: "",
  role: "guest",
  avatar: null,
  dateOfBirth: null,
  rollNumber: null,
  class: null,
  section: null,
  guardianName: null,
  guardianPhone: null,
  bio: "",
};

const Profile = () => {
  const [user, setUser] = useState(initialUserState);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(initialUserState);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching Effect (REAL BACKEND) ---
  useEffect(() => {
    const userId = localStorage.getItem("userId") || 1;

    setIsLoading(true);
    getUser(userId)
      .then((data) => {
        // Filter out unwanted fields and ensure structural completeness
        const { department, location, ...cleanedData } = data;

        const userWithDefaults = {
          ...initialUserState,
          ...cleanedData,
        };
        setUser(userWithDefaults);
        setEditedUser(userWithDefaults);
        toast.success("Profile loaded successfully.");
      })
      .catch((error) => {
        console.error("Profile load failed:", error);
        toast.error("Failed to load profile. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // --- Handler Functions ---
  const handleSave = () => {
    if (!editedUser.name || !editedUser.email) {
      toast.error("Name and Email are required.");
      return;
    }

    // Only send the fields present in editedUser state
    updateUser(user.id, editedUser)
      .then((data) => {
        // Filter out unwanted fields from the returned data too
        const { department, location, ...cleanedData } = data;

        const updatedUser = {
          ...initialUserState,
          ...cleanedData,
        };
        setUser(updatedUser);
        setEditedUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      })
      .catch(() => toast.error("Failed to update profile."));
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  // --- Utility Functions (unchanged) ---
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "teacher":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "student":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-400 hover:bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xl font-medium">
        Loading profile data...
      </div>
    );
  }

  const InfoRow = ({ label, value }) => (
    <div>
      <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider block">
        {label}:
      </span>
      <p className="text-foreground text-base mt-0.5 break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // --- Rendered Component ---
  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header and Edit Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            View and manage your personal and institutional information.
          </p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          {/* Edit Dialog Content */}
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal and contact information below. Click save
                when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Basic Info Fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={editedUser.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editedUser.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>

                {/* Department/Location fields REMOVED from the Edit Dialog */}

                {/* Student Specific Fields */}
                {user.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={editedUser.rollNumber || ""}
                        onChange={(e) =>
                          handleInputChange("rollNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Input
                        id="class"
                        value={editedUser.class || ""}
                        onChange={(e) =>
                          handleInputChange("class", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={editedUser.section || ""}
                        onChange={(e) =>
                          handleInputChange("section", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input
                        id="guardianName"
                        value={editedUser.guardianName || ""}
                        onChange={(e) =>
                          handleInputChange("guardianName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianPhone">Guardian Phone</Label>
                      <Input
                        id="guardianPhone"
                        value={editedUser.guardianPhone || ""}
                        onChange={(e) =>
                          handleInputChange("guardianPhone", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio / About Me</Label>
                <Textarea
                  id="bio"
                  value={editedUser.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Main Profile Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Left Column: Profile Overview */}
        <Card className="lg:col-span-1 xl:col-span-1 h-fit shadow-lg">
          <CardHeader className="text-center p-6">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <Avatar className="w-32 h-32 border-4 border-primary shadow-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background border-2"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-extrabold">
              {user.name}
            </CardTitle>
            <Badge
              className={`mt-1 text-sm font-semibold ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Guest"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 pb-6 border-t mx-6">
            {/* Contact Info */}
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.phone || "N/A"}
              </span>
            </div>
            {/* Department/Location fields REMOVED from the Overview */}

            {/* Academic Info (Student roles) */}
            {user.role === "student" && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Class {user.class || "N/A"} / Section{" "}
                    {user.section || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Roll No: {user.rollNumber || "N/A"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Columns: Detailed Information */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Card 1: Personal Information */}
          <Card className="shadow-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal & Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Adjusted grid to 2 columns since location/department are gone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow label="Full Name" value={user.name} />
                <InfoRow label="Email Address" value={user.email} />
                <InfoRow label="Phone Number" value={user.phone} />
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(user.dateOfBirth)}
                />

                {user.role === "student" && (
                  <>
                    <InfoRow label="Guardian Name" value={user.guardianName} />
                    <InfoRow
                      label="Guardian Phone"
                      value={user.guardianPhone}
                    />
                  </>
                )}
                {/* Department/Location InfoRow REMOVED from the detail card */}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Bio / Institutional Details */}
          <Card className="shadow-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                {user.role === "student" ? "Academic Details" : "Biography"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {user.bio ? (
                <div className="mb-6">
                  <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider block mb-1">
                    Biography:
                  </span>
                  <p className="text-foreground text-base whitespace-pre-wrap">
                    {user.bio}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic mb-6">
                  No biography provided.
                </p>
              )}

              {user.role === "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow label="Roll Number" value={user.rollNumber} />
                  <InfoRow label="Class" value={user.class} />
                  <InfoRow label="Section" value={user.section} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Recent Activity (unchanged) */}
          <Card className="shadow-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Profile viewed</span>
                  <span className="text-muted-foreground ml-auto">
                    Just now
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Logged in successfully</span>
                  <span className="text-muted-foreground ml-auto">Today</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Updated personal information</span>
                  <span className="text-muted-foreground ml-auto">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
