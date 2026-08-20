package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTodoDto(
        @NotBlank(message = "title is required") String title,

        @JsonProperty("isComplete") Boolean isComplete,

        @NotNull(message = "categoryId is required") Long categoryId) {
}