package com.example.demo.service;

import com.example.demo.dto.CategoryResponse;
import com.example.demo.dto.CreateCategoryDto;
import com.example.demo.mapper.CategoryMapper;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import com.example.demo.dto.UpdateCategoryDto;
import com.example.demo.exception.NotFoundException;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<CategoryResponse> findAll() {
        List<Category> categories = repository.findAll();

        return categories.stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse create(CreateCategoryDto dto) {
        Category category = new Category(dto.name().trim());
        Category saved = repository.save(category);

        return CategoryMapper.toResponse(saved);
    }

    public CategoryResponse update(Long id, UpdateCategoryDto dto) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id " + id));

        if (dto.name() != null) {
            category.setName(dto.name().trim());
        }

        return CategoryMapper.toResponse(repository.save(category));
    }

    public void delete(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id " + id));

        repository.delete(category);
    }
}