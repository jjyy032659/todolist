package com.example.demo;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class CategoryIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    void createCategory_returns201WithId() {
        given()
                .contentType("application/json")
                .body("{\"name\":\"Work\"}")
                .when()
                .post("/categories")
                .then()
                .statusCode(201)
                .body("id", notNullValue())
                .body("name", equalTo("Work"));
    }

    @Test
    void createCategory_blankName_returns400() {
        given()
                .contentType("application/json")
                .body("{\"name\":\"\"}")
                .when()
                .post("/categories")
                .then()
                .statusCode(400);
    }

    @Test
    void patchCategory_unknownId_returns404() throws Exception {
        mockMvc.perform(patch("/categories/9999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Nope\"}"))
                .andExpect(status().isNotFound());
    }
}