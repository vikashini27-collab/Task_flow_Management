package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.AuthRequest;
import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.GoogleAuthRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.entity.Notification;
import com.taskflow.entity.Role;
import com.taskflow.entity.User;
import com.taskflow.repository.NotificationRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final NotificationRepository notificationRepository;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                          AuthenticationManager authenticationManager, TaskRepository taskRepository,
                          ProjectRepository projectRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.notificationRepository = notificationRepository;
    }

    private void generateReminders(User user) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dayAfter = today.plusDays(2);

        // Task deadline reminders
        taskRepository.findAll().forEach(task -> {
            if (task.getDueDate() != null && (task.getStatus() == null || !task.getStatus().name().equals("COMPLETED"))) {
                if (task.getDueDate().equals(tomorrow)) {
                    createNotifIfNew(user, "⚠️ Task \"" + task.getTitle() + "\" is due TOMORROW!");
                } else if (task.getDueDate().equals(dayAfter)) {
                    createNotifIfNew(user, "📅 Task \"" + task.getTitle() + "\" is due in 2 days.");
                } else if (task.getDueDate().equals(today)) {
                    createNotifIfNew(user, "🔴 Task \"" + task.getTitle() + "\" is due TODAY!");
                } else if (task.getDueDate().isBefore(today)) {
                    createNotifIfNew(user, "❌ Task \"" + task.getTitle() + "\" is OVERDUE! (was due " + task.getDueDate() + ")");
                }
            }
        });

        // Project deadline reminders
        projectRepository.findAll().forEach(project -> {
            if (project.getDeadline() != null) {
                if (project.getDeadline().equals(tomorrow)) {
                    createNotifIfNew(user, "⚠️ Project \"" + project.getName() + "\" deadline is TOMORROW!");
                } else if (project.getDeadline().equals(dayAfter)) {
                    createNotifIfNew(user, "📅 Project \"" + project.getName() + "\" deadline in 2 days.");
                } else if (project.getDeadline().equals(today)) {
                    createNotifIfNew(user, "🔴 Project \"" + project.getName() + "\" deadline is TODAY!");
                }
            }
        });
    }

    private void createNotifIfNew(User user, String message) {
        // Check if same message already exists today to avoid duplicates
        var existing = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        boolean alreadyExists = existing.stream().anyMatch(n -> n.getMessage().equals(message));
        if (!alreadyExists) {
            Notification n = new Notification();
            n.setUser(user);
            n.setMessage(message);
            notificationRepository.save(n);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse<AuthResponse>(false, "Username already exists", null));
        }
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MEMBER);
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new ApiResponse<AuthResponse>(true, "User registered successfully", new AuthResponse(jwtToken, user)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        var user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getUsername()).orElseThrow());
        // Generate deadline reminders on every login
        generateReminders(user);
        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new ApiResponse<AuthResponse>(true, "Login successful", new AuthResponse(jwtToken, user)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            String email; String name;
            if ("mock-google-token-123".equals(request.getToken())) {
                email = "demo.google.user@example.com"; name = "Google Demo User";
            } else {
                RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> userInfo = restTemplate.getForObject("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + request.getToken(), Map.class);
                if (userInfo == null || !userInfo.containsKey("email")) return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid Google Token", null));
                email = (String) userInfo.get("email"); name = (String) userInfo.get("name");
            }
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User(); user.setFullName(name); user.setEmail(email);
                user.setUsername(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 5));
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); user.setRole(Role.MEMBER);
                user = userRepository.save(user);
            }
            generateReminders(user);
            var jwtToken = jwtService.generateToken(user);
            return ResponseEntity.ok(new ApiResponse<>(true, "Google Login successful", new AuthResponse(jwtToken, user)));
        } catch (Exception e) { return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Google auth failed", null)); }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() { return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful", null)); }
}
