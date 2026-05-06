import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
  X,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"; // Assuming this component is available
import { Label } from "@/components/ui/label.jsx";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge.jsx";
import AllDropdown from "@/components/AllDropdown.jsx";
import StatsCard from "@/components/dashboard/StatsCard.jsx"; // Assuming you have this
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "@/utils/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({
    department: "",
    division: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments and divisions for filter options
  const departments = [
    ...new Set(students.map((student) => student.department)),
  ].filter(Boolean); // Filter out empty strings
  const divisions = [
    ...new Set(students.map((student) => student.division)),
  ].filter(Boolean); // Filter out empty strings

  const isFilterActive =
    searchTerm ||
    departmentFilter !== "all" ||
    divisionFilter !== "all" ||
    statusFilter !== "all";

  // Filter students based on search term and filters
  const filteredStudents = students.filter((student) => {
    // Admin filters
    if (departmentFilter !== "all" && student.department !== departmentFilter) {
      return false;
    }
    if (divisionFilter !== "all" && student.division !== divisionFilter) {
      return false;
    }
    if (statusFilter !== "all" && student.status !== statusFilter) {
      return false;
    }

    // Search term filtering
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower)
    );
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setDivisionFilter("all");
    setStatusFilter("all");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student");
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      phone: student.phone,
      department: student.department,
      division: student.division,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      address: student.address,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      status: student.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(selectedStudent.id, editFormData);
      const updatedStudents = students.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, ...editFormData }
          : student,
      );
      setStudents(updatedStudents);
      toast.success("Student updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error("Failed to update student");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newStudent = await addStudent(addFormData);
      setStudents([...students, newStudent]);
      toast.success("Student added successfully");
      setIsAddModalOpen(false);
      setAddFormData({ department: "", division: "", status: "active" });
    } catch (error) {
      console.error("Failed to add student:", error);
      toast.error("Failed to add student");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Student Records
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and information
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Student
            </Button>
          </DialogTrigger>
          {/* Add Modal Content (Unchanged for brevity) */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* ... (Add form content) ... */}
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Fill in the student information below
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={addFormData.name || ""}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@school.com"
                    value={addFormData.email || ""}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roll">Roll Number</Label>
                  <Input
                    id="roll"
                    placeholder="2024001"
                    value={addFormData.rollNumber || ""}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        rollNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={addFormData.phone || ""}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, phone: e.target.value })
                    }
                  />
                </div>
                <AllDropdown
                  selectedDepartment={addFormData.department}
                  selectedDivision={addFormData.division}
                  onDepartmentChange={(value) =>
                    setAddFormData({ ...addFormData, department: value })
                  }
                  onDivisionChange={(value) =>
                    setAddFormData({ ...addFormData, division: value })
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={addFormData.status || "active"}
                    onValueChange={(value) =>
                      setAddFormData({ ...addFormData, status: value })
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
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={addFormData.dateOfBirth || ""}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={addFormData.gender || ""}
                    onValueChange={(value) =>
                      setAddFormData({ ...addFormData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City"
                    value={addFormData.address || ""}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardian">Parent Name</Label>
                  <Input
                    id="guardian"
                    placeholder="Parent Name"
                    value={addFormData.guardianName || ""}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        guardianName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Parent Number</Label>
                  <Input
                    id="guardianPhone"
                    placeholder="+1234567891"
                    value={addFormData.guardianPhone || ""}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        guardianPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Students"
          value={students.length.toString()}
          icon={Eye}
          color="primary"
        />
        <StatsCard
          title="Filtered Students"
          value={filteredStudents.length.toString()}
          icon={Filter}
          color="secondary"
        />
        <StatsCard
          title="Active Students"
          value={students
            .filter((s) => s.status === "active")
            .length.toString()}
          icon={Plus}
          color="success"
        />
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm pt-6 pb-4 -mx-6 px-6">
          <div className="flex flex-col gap-4">
            {/* Search and Title Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Student List</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by Name, Roll No, Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  <span>Quick Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={divisionFilter}
                    onValueChange={setDivisionFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Divisions</SelectItem>
                      {divisions.map((div) => (
                        <SelectItem key={div} value={div}>
                          {div}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isFilterActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-1 mt-2 sm:mt-0"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Phone
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleView(student)}
                    >
                      <TableCell className="font-medium">
                        {student.rollNumber}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        {student.department} - {student.division}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {student.phone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(student)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(student)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student.id)}
                              className="cursor-pointer text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-4" />
                <p className="text-xl font-semibold">
                  No Students Match Your Criteria
                </p>
                <p className="mt-2">
                  Try clearing your filters or adjusting your search term.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Modal (Title updated) */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              View Details for {selectedStudent?.name || "Student"}
            </DialogTitle>
            <DialogDescription>
              Full personal and academic information.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            // ... (View content unchanged)
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-medium">{selectedStudent.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">
                    {selectedStudent.department}-{selectedStudent.division}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedStudent.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{selectedStudent.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedStudent.status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedStudent.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedStudent.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p className="font-medium">{selectedStudent.guardianName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Number</p>
                  <p className="font-medium">{selectedStudent.guardianPhone}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal (Title updated) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Details for {selectedStudent?.name || "Student"}
            </DialogTitle>
            <DialogDescription>
              Update the student information below
            </DialogDescription>
          </DialogHeader>
          {/* ... (Edit form content unchanged for brevity) */}
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
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-roll">Roll Number</Label>
                <Input
                  id="edit-roll"
                  value={editFormData.rollNumber || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      rollNumber: e.target.value,
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
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                />
              </div>
              <AllDropdown
                selectedDepartment={editFormData.department || ""}
                selectedDivision={editFormData.division || ""}
                onDepartmentChange={(value) =>
                  setEditFormData({ ...editFormData, department: value })
                }
                onDivisionChange={(value) =>
                  setEditFormData({ ...editFormData, division: value })
                }
              />
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
              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={editFormData.dateOfBirth || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={editFormData.gender || ""}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editFormData.address || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-guardian">Parent Name</Label>
                <Input
                  id="edit-guardian"
                  value={editFormData.guardianName || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      guardianName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-guardianPhone">Parent Number</Label>
                <Input
                  id="edit-guardianPhone"
                  value={editFormData.guardianPhone || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      guardianPhone: e.target.value,
                    })
                  }
                />
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
              <Button type="submit">Update Student</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
