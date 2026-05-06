import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Label } from "@/components/ui/label.jsx";
import { departments, divisions } from "@/utils/mockData.jsx";

const AllDropdown = ({
  selectedDepartment,
  selectedDivision,
  onDepartmentChange,
  onDivisionChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="division">Division</Label>
        <Select value={selectedDivision} onValueChange={onDivisionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((div) => (
              <SelectItem key={div.value} value={div.value}>
                {div.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AllDropdown;
