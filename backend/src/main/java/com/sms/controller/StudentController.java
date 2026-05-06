package com.sms.controller;

import com.sms.entity.Student;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // ✅ Get a student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        Optional<Student> student = studentRepository.findById(id);

        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Student not found"));
        }
    }

    // ✅ Add a new student
    @PostMapping
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    // ✅ Update student
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Student not found"));
        }
        updatedStudent.setId(id);
        Student saved = studentRepository.save(updatedStudent);
        return ResponseEntity.ok(saved);
    }

    // ✅ Delete student (return JSON always)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Student not found"));
        }

        studentRepository.deleteById(id);
        // Always return a JSON body
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
}
