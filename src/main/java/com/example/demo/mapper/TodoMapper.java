package com.example.demo.mapper;

import com.example.demo.dto.TodoResponse;
import com.example.demo.model.Todo;

public final class TodoMapper {

    private TodoMapper() {
    }

    public static TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.isComplete(),
                CategoryMapper.toResponse(todo.getCategory()));
    }
}