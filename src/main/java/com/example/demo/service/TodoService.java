package com.example.demo.service;

import com.example.demo.dto.CreateTodoDto;
import com.example.demo.dto.TodoResponse;
import com.example.demo.dto.UpdateTodoDto;
import com.example.demo.exception.NotFoundException;
import com.example.demo.mapper.TodoMapper;
import com.example.demo.model.Category;
import com.example.demo.model.Todo;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;

    public TodoService(TodoRepository todoRepository, CategoryRepository categoryRepository) {
        this.todoRepository = todoRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> findAll() {
        return todoRepository.findAll()
                .stream()
                .map(TodoMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TodoResponse findById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Todo not found with id " + id));

        return TodoMapper.toResponse(todo);
    }

    @Transactional
    public TodoResponse create(CreateTodoDto dto) {
        Category category = findCategoryOrThrow(dto.categoryId());

        Todo todo = new Todo(
                dto.title().trim(),
                dto.isComplete() != null && dto.isComplete(),
                category);

        return TodoMapper.toResponse(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse update(Long id, UpdateTodoDto dto) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Todo not found with id " + id));

        if (dto.title() != null && !dto.title().isBlank()) {
            todo.setTitle(dto.title().trim());
        }
        if (dto.isComplete() != null) {
            todo.setComplete(dto.isComplete());
        }
        if (dto.categoryId() != null) {
            todo.setCategory(findCategoryOrThrow(dto.categoryId()));
        }

        return TodoMapper.toResponse(todoRepository.save(todo));
    }

    @Transactional
    public void delete(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Todo not found with id " + id));

        todoRepository.delete(todo);
    }

    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id " + categoryId));
    }
}