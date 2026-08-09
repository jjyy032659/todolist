package com.example.demo.mapper;

import com.example.demo.dto.CategoryResponse;
import com.example.demo.model.Category;

public final class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}