import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Label } from "@/components/ui/label.jsx";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge.jsx";
import { getUsers, addUser, updateUser, deleteUser } from "@/utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    status: "active",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Get unique roles for filter options
  const roles = [
    ...new Set(users.map((user) => user.role).filter((role) => role)),
  ];

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    // Admin filters
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false;
    }

    // Search term filtering
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, editFormData);
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...editFormData } : user
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await addUser(addFormData);
      setUsers([...users, newUser]);
      toast.success("User added successfully");
      setIsAddModalOpen(false);
      setAddFormData({
        name: "",
        email: "",
        phone: "",
        role: "student",
        status: "active",
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add user");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  User List
                </h3>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-700">
                <TableRow>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                    Role
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                    Phone
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-slate-700 dark:text-slate-300 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {user.phone || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-300"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(user)}
                          className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedUser.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">
                      {selectedUser.created_at
                        ? new Date(selectedUser.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the user information below
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editFormData.role || ""}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editFormData.status || ""}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Users;
