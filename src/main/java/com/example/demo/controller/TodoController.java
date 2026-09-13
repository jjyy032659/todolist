package com.example.demo.controller;

import com.example.demo.dto.CreateTodoDto;
import com.example.demo.dto.TodoResponse;
import com.example.demo.dto.UpdateTodoDto;
import com.example.demo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> create(@Valid @RequestBody CreateTodoDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.create(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TodoResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTodoDto dto) {
        return ResponseEntity.ok(todoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        todoService.archive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAll(
            @RequestParam(name = "category", required = false) List<String> categories) {
        return ResponseEntity.ok(todoService.findAll(categories));
    }
}