import { Users, UserCheck, UserX, ListChecks, Calendar } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard.jsx"; // Assuming this is now a simpler card
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { format } from "date-fns"; // Utility for date formatting

// Import the specific functions from your utility file
import {
  getDashboardStats,
  getStudentsByDepartment,
  getStudentsByDivision,
  getGenderDistribution,
  getRecentEnrollments,
} from "@/utils/api";

// ... (departments and divisions arrays remain the same) ...

// Updated COLORS array to include three for Gender stack
const COLORS = [
  "hsl(var(--primary))", // Active (Pie) / Male (Stack) / Dept (Bar)
  "hsl(var(--warning))", // Inactive (Pie) / Female (Stack) / Division (Bar)
  "hsl(var(--info))", // Other (Stack)
  "hsl(var(--success))",
  "hsl(var(--danger))",
];

// Helper component for the Recent Enrollments List
const RecentEnrollmentsCard = ({ students }) => (
  <Card className="shadow-card border-border/50 h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xl font-bold">Recent Enrollments</CardTitle>
      <Calendar className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {students.length > 0 ? (
        <ul className="space-y-3">
          {students.map((student, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.department}
                </p>
              </div>
              <div className="text-sm text-right">
                <p>{format(new Date(student.enrollmentDate), "MMM d, yyyy")}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-muted-foreground flex items-center justify-center p-4">
          No recent enrollment data available.
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // REMOVED 'growthRate' from initial state, simplifying the expected data structure
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalUsers: 0,
  });
  const [studentsByDepartment, setStudentsByDepartment] = useState([]);
  const [studentsByDivision, setStudentsByDivision] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const basicData = await getDashboardStats();

        // Ensure the received data is filtered to the simplified state structure
        const { growthRate, ...cleanedData } = basicData;
        setStats(cleanedData);

        const [dept, div, gender, recent] = await Promise.all([
          getStudentsByDepartment(),
          getStudentsByDivision(),
          getGenderDistribution(),
          getRecentEnrollments(),
        ]);

        setStudentsByDepartment(dept || []);
        setStudentsByDivision(div || []);
        setGenderDistribution(gender || []);
        setRecentEnrollments(recent || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Updated fallback state
        setStats({ totalStudents: 0, activeStudents: 0, totalUsers: 0 });
        setStudentsByDepartment([]);
        setStudentsByDivision([]);
        setGenderDistribution([]);
        setRecentEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inactiveStudents = stats.totalStudents - stats.activeStudents;

  // Data for the Pie Chart (Status Distribution)
  const statusData = [
    { name: "Active", value: stats.activeStudents },
    { name: "Inactive", value: inactiveStudents >= 0 ? inactiveStudents : 0 },
  ];

  // Helper function for Bar Chart Tooltip formatting
  const barTooltipFormatter = (value, name, props) => {
    return [
      `${value} Students`,
      props.payload.department || props.payload.division || name,
    ];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Student Management Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your live overview from the database.
        </p>
      </div>

      {/* Stats Cards - Comparison elements REMOVED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          icon={Users}
          // REMOVED: trend={{ value: "—", isPositive: true }}
          color="primary"
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents.toString()}
          icon={UserCheck}
          // REMOVED: trend={{ value: "—", isPositive: true }}
          color="success"
        />
        <StatsCard
          title="Inactive Students"
          value={inactiveStudents.toString()}
          icon={UserX}
          // REMOVED: trend={{ value: "—", isPositive: false }}
          color="warning"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={ListChecks}
          // REMOVED: trend={{ value: "—", isPositive: true }}
          color="secondary"
        />
      </div>

      {/* --- Charts Row 1: Gender Distribution (Stacked Bar - 2/3) & Status (Pie - 1/3) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution by Department (Stacked Bar Chart - takes 2/3 space) */}
        <Card className="shadow-card border-border/50 animate-slide-up lg:col-span-2">
          <CardHeader>
            <CardTitle>Gender Distribution by Department</CardTitle>
            <CardDescription>
              Breakdown of male, female, and other students per department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {genderDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={genderDistribution}
                  margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="department"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill={COLORS[0]} />
                  <Bar dataKey="female" stackId="a" fill={COLORS[1]} />
                  <Bar dataKey="other" stackId="a" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                No gender distribution data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Status Distribution (Pie Chart - takes 1/3 space) */}
        <Card
          className="shadow-card border-border/50 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader>
            <CardTitle>Student Status Distribution</CardTitle>
            <CardDescription>Active vs Inactive students</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {stats.totalStudents > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % 2]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${(
                        (value / stats.totalStudents) *
                        100
                      ).toFixed(1)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                No student data to display.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Charts Row 2: Department, Division, and Recent Enrollments --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Count by Department (Bar Chart - 1/3 space) */}
        <Card
          className="shadow-card border-border/50 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle>Students by Department</CardTitle>
            <CardDescription>
              Distribution of students across departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsByDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={studentsByDepartment}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="department"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={barTooltipFormatter}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    name="Total Students"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                No department data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Count by Division (Bar Chart - 1/3 space) */}
        <Card
          className="shadow-card border-border/50 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <CardHeader>
            <CardTitle>Students by Division</CardTitle>
            <CardDescription>
              Breakdown of students across divisions (e.g., A, B, C, D).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsByDivision.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={studentsByDivision}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="division"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={barTooltipFormatter}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--secondary))"
                    name="Total Students in Division"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                No division data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments List (1/3 space) */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <RecentEnrollmentsCard students={recentEnrollments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
