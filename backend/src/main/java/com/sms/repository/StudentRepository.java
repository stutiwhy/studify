package com.sms.repository;

import com.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {


    // ✅ 2. Students by Department
    @Query("""
        SELECT s.department AS department, COUNT(s.id) AS count 
        FROM Student s 
        GROUP BY s.department 
        ORDER BY count DESC
        """)
    List<Map<String, Object>> countStudentsByDepartment();

    // ✅ 3. Students by Division
    @Query("""
        SELECT s.division AS division, COUNT(s.id) AS count 
        FROM Student s 
        GROUP BY s.division 
        ORDER BY count DESC
        """)
    List<Map<String, Object>> countStudentsByDivision();

    // 3. NEW: Gender Distribution by Department - JPQL
    @Query("SELECT s.department as department, s.gender as gender, COUNT(s.id) as count FROM Student s GROUP BY s.department, s.gender")
    List<Map<String, Object>> findGenderDistributionByDepartment();

    // 4. NEW: Top 5 Recent Enrollments - Simple list
    List<Student> findTop5ByOrderByEnrollmentDateDesc();
}
