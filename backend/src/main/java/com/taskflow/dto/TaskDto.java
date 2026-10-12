package com.taskflow.dto;
import lombok.Data;
import java.time.LocalDate;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
@Data public class TaskDto {
    private Long id; private String title; private String description;
    private Long projectId; private Long assignedUserId;
    private TaskPriority priority; private TaskStatus status;
    private LocalDate startDate; private LocalDate dueDate; private String tags;
}
