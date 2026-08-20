package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TodoResponse(
        Long id,
        String title,
        @JsonProperty("isComplete") boolean isComplete,
        CategoryResponse category) {
}