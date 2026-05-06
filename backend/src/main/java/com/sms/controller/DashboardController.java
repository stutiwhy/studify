package com.sms.controller;

import com.sms.entity.Student;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"}) // ✅ Allow both dev servers
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    // --- Helper DTO for Stacked Chart ---
    public static class DepartmentGenderStats {
        private String department;
        private long male = 0;
        private long female = 0;
        private long other = 0;

        public DepartmentGenderStats(String department) {
            this.department = department;
        }

        public String getDepartment() { return department; }
        public long getMale() { return male; }
        public long getFemale() { return female; }
        public long getOther() { return other; }

        public void setDepartment(String department) { this.department = department; }
        public void setMale(long male) { this.male = male; }
        public void setFemale(long female) { this.female = female; }
        public void setOther(long other) { this.other = other; }
    }

    // ✅ 1. Basic Dashboard Stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBasicStats() {
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.findAll().stream()
                .filter(s -> "active".equalsIgnoreCase(s.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("activeStudents", activeStudents);
        stats.put("totalUsers", 10); // placeholder
        stats.put("growthRate", "+2.5%"); // placeholder

        return ResponseEntity.ok(stats);
    }

    // ✅ 2. Students by Department
    @GetMapping("/department-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getStudentsByDepartment() {
        List<Map<String, Object>> deptData = studentRepository.countStudentsByDepartment();
        return ResponseEntity.ok(deptData);
    }

    // ✅ 3. Students by Division
    @GetMapping("/division-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getStudentsByDivision() {
        List<Map<String, Object>> divData = studentRepository.countStudentsByDivision();
        return ResponseEntity.ok(divData);
    }

    // ✅ 4. Gender Distribution by Department
    @GetMapping("/gender-distribution")
    public ResponseEntity<List<DepartmentGenderStats>> getGenderDistributionByDepartment() {
        List<Map<String, Object>> rawData = studentRepository.findGenderDistributionByDepartment();
        Map<String, DepartmentGenderStats> statsMap = new LinkedHashMap<>();

        for (Map<String, Object> row : rawData) {
            String dept = (String) row.get("department");
            String gender = (String) row.get("gender");
            Long count = (Long) row.get("count");

            if (dept == null) dept = "Unknown";
            if (gender == null) gender = "Other";
            if (count == null) count = 0L;

            DepartmentGenderStats stats = statsMap.computeIfAbsent(dept, DepartmentGenderStats::new);

            switch (gender.toLowerCase()) {
                case "male" -> stats.setMale(count);
                case "female" -> stats.setFemale(count);
                default -> stats.setOther(count);
            }
        }

        return ResponseEntity.ok(new ArrayList<>(statsMap.values()));
    }

    // ✅ 5. Top 5 Recent Enrollments
    @GetMapping("/recent-enrollments")
    public ResponseEntity<List<Student>> getRecentEnrollments() {
        List<Student> recentStudents = studentRepository.findTop5ByOrderByEnrollmentDateDesc();
        return ResponseEntity.ok(recentStudents);
    }
}
