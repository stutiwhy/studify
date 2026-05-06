
package com.sms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String rollNumber;
    private String phone;
    private String department;
    private String division;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private String status;
    private LocalDate enrollmentDate;
}
