package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateTodoDto(
        String title,
        @JsonProperty("isComplete") Boolean isComplete,
        Long categoryId) {
}