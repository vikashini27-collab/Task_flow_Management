package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.entity.Project;
import com.taskflow.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Projects fetched", projectRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Map<String, String> body) {
        Project project = new Project();
        project.setName(body.getOrDefault("name", "Untitled Project"));
        project.setDescription(body.getOrDefault("description", ""));
        if (body.containsKey("deadline") && !body.get("deadline").isEmpty()) {
            try { project.setDeadline(LocalDate.parse(body.get("deadline"))); } catch (Exception e) {}
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Project created", projectRepository.save(project)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Project deleted", null));
    }
}
