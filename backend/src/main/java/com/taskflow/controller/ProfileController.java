package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new ApiResponse<User>(true, "Profile fetched", user));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<User>> updateProfile(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse<User>(true, "Profile updated", user));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse<String>(true, "Password changed", null));
    }
}
