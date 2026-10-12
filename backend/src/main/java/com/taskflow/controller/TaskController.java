package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import com.taskflow.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched", taskRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(@RequestBody Map<String, String> body) {
        Task task = new Task();
        task.setTitle(body.getOrDefault("title", "Untitled"));
        task.setDescription(body.getOrDefault("description", ""));
        try { task.setPriority(TaskPriority.valueOf(body.getOrDefault("priority", "MEDIUM"))); } catch (Exception e) { task.setPriority(TaskPriority.MEDIUM); }
        try { task.setStatus(TaskStatus.valueOf(body.getOrDefault("status", "TODO"))); } catch (Exception e) { task.setStatus(TaskStatus.TODO); }
        if (body.containsKey("dueDate") && !body.get("dueDate").isEmpty()) {
            try { task.setDueDate(LocalDate.parse(body.get("dueDate"))); } catch (Exception e) {}
        }
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Task task = taskRepository.findById(id).orElseThrow();
        if (body.containsKey("title")) task.setTitle(body.get("title"));
        if (body.containsKey("description")) task.setDescription(body.get("description"));
        if (body.containsKey("priority")) { try { task.setPriority(TaskPriority.valueOf(body.get("priority"))); } catch (Exception e) {} }
        if (body.containsKey("status")) { try { task.setStatus(TaskStatus.valueOf(body.get("status"))); } catch (Exception e) {} }
        if (body.containsKey("dueDate") && !body.get("dueDate").isEmpty()) { try { task.setDueDate(LocalDate.parse(body.get("dueDate"))); } catch (Exception e) {} }
        return ResponseEntity.ok(new ApiResponse<>(true, "Task updated", taskRepository.save(task)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(TaskStatus.valueOf(statusMap.get("status")));
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated", taskRepository.save(task)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted", null));
    }
}
