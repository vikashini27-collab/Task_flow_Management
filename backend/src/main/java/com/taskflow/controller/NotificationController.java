package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.Notification;
import com.taskflow.entity.User;
import com.taskflow.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new ApiResponse<List<Notification>>(true, "ok", notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> unreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new ApiResponse<Long>(true, "ok", notificationRepository.countByUserIdAndIsRead(user.getId(), false)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> create(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(body.getOrDefault("message", "New notification"));
        notificationRepository.save(n);
        return ResponseEntity.ok(new ApiResponse<Notification>(true, "Created", n));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markRead(@PathVariable Long id) {
        var n = notificationRepository.findById(id);
        n.ifPresent(notif -> { notif.setRead(true); notificationRepository.save(notif); });
        return ResponseEntity.ok(new ApiResponse<String>(true, "Marked read", null));
    }
}
