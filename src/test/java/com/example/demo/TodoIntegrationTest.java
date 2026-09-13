package com.example.demo;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;

@SpringBootTest
@AutoConfigureMockMvc
class TodoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private int createCategory(String name) throws Exception {
        String body = mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"" + name + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return JsonPath.read(body, "$.id");
    }

    private int createTodo(String title, int categoryId) throws Exception {
        String body = mockMvc.perform(post("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"" + title + "\",\"categoryId\":" + categoryId + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return JsonPath.read(body, "$.id");
    }

    @Test
    void deletedTodo_isHiddenFromApi() throws Exception {
        int categoryId = createCategory("SoftDeleteCat");
        int todoId = createTodo("Will be archived", categoryId);

        mockMvc.perform(get("/todos/" + todoId))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/todos/" + todoId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/todos/" + todoId))
                .andExpect(status().isNotFound());
    }

    @Test
    void filterByCategory_returnsOnlyThatCategory() throws Exception {
        int workId = createCategory("FilterWork");
        int homeId = createCategory("FilterHome");

        createTodo("Work task one", workId);
        createTodo("Work task two", workId);
        createTodo("Home task", homeId);

        mockMvc.perform(get("/todos").param("category", "FilterWork"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].category.name").value("FilterWork"))
                .andExpect(jsonPath("$[1].category.name").value("FilterWork"));
    }
}