package com.kanban.server.services;

import com.kanban.server.models.task.TaskDAO;
import com.kanban.server.models.task.TaskDTO;
import com.kanban.server.repository.TaskRepository;
import com.kanban.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;
    @Autowired
    UserRepository userRepository;
    public TaskDTO addTask(TaskDTO task) {
        TaskDAO taskDAO= taskRepository.save(TaskDAO.builder().title(task.getTitle()).description(task.getDescription()).status(task.getStatus()).assignedTo(userRepository.findById(task.getAssignedTo()).get()).build());
        return TaskDTO.builder().id(taskDAO.getId()).title(taskDAO.getTitle()).description(taskDAO.getDescription()).status(taskDAO.getStatus()).assignedTo(taskDAO.getAssignedTo().getId()).build();
    }
    public List<TaskDTO> getAllTasks(){
        List<TaskDTO> taskDTOS= new ArrayList <>();
       taskRepository.findAll().forEach(taskDAO ->
               taskDTOS.add(TaskDTO.builder().id(taskDAO.getId()).title(taskDAO.getTitle()).description(taskDAO.getDescription()).status(taskDAO.getStatus()).assignedTo(taskDAO.getAssignedTo().getId()).build()
               ));
        return taskDTOS;
    }
}
