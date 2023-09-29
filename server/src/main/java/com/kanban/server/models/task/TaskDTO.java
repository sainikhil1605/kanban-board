package com.kanban.server.models.task;

import lombok.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private long id;
    private String taskId;

    public String getTaskId() {
        return "ASE"+"-"+String.valueOf(id);
    }
    public String setTaskId() {
        return "ASE"+"-"+String.valueOf(id);
    }

    private String title;
    private String description;
    private String status;
    private long assignedTo;
}
