package com.sms.controller;

import com.sms.entity.User;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"}) // ✅ Allow both dev servers
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 1. Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ 2. Get user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ✅ 3. Create new user
    @PostMapping
    public User createUser(@RequestBody User newUser) {
        return userRepository.save(newUser);
    }

    // ✅ 4. Update user (profile editing, etc.)
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());

        // Optional fields
        if (updatedUser.getPhone() != null)
            user.setPhone(updatedUser.getPhone());
        if (updatedUser.getDateOfBirth() != null)
            user.setDateOfBirth(updatedUser.getDateOfBirth());
        if (updatedUser.getBio() != null)
            user.setBio(updatedUser.getBio());

        return userRepository.save(user);
    }

    // ✅ 5. Delete user by ID
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // ✅ 6. Count total users (for dashboard)
    @GetMapping("/count")
    public long getUserCount() {
        return userRepository.count();
    }

    // ✅ 7. Optional: Find user by email
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
