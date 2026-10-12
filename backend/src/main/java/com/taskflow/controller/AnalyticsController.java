package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.TaskStatus;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public AnalyticsController(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", taskRepository.count());
        stats.put("completedTasks", taskRepository.countByStatus(TaskStatus.COMPLETED));
        stats.put("inProgressTasks", taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
        stats.put("todoTasks", taskRepository.countByStatus(TaskStatus.TODO));
        stats.put("overdueTasks", taskRepository.countByStatus(TaskStatus.OVERDUE));
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(new ApiResponse<Map<String, Object>>(true, "Dashboard stats", stats));
    }
}
