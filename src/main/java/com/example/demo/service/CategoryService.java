package com.example.demo.service;

import com.example.demo.dto.CategoryResponse;
import com.example.demo.dto.CreateCategoryDto;
import com.example.demo.mapper.CategoryMapper;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;

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
}