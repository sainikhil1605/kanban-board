package com.kanban.server.controllers;

import com.kanban.server.models.task.TaskDAO;
import com.kanban.server.models.task.TaskDTO;
import com.kanban.server.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins="http://localhost:3000")
public class TaskController {
    @Autowired
    TaskService taskService;
    @PostMapping("/addtask")
    public TaskDTO addTask(@RequestBody TaskDTO task) {
        System.out.println(task);
        return taskService.addTask(task);
    }
    @GetMapping("")
    public ResponseEntity<List<TaskDTO>> getAllTasks(){
        return new ResponseEntity<List<TaskDTO>>(taskService.getAllTasks(), HttpStatus.OK);
    }
}
