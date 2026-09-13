package com.example.demo.repository;

import com.example.demo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t JOIN FETCH t.category WHERE t.isArchived = false")
    List<Todo> findAllActive();

    @Query("SELECT t FROM Todo t JOIN FETCH t.category WHERE t.id = :id AND t.isArchived = false")
    Optional<Todo> findActiveById(@Param("id") Long id);

    @Query("SELECT t FROM Todo t JOIN FETCH t.category c "
            + "WHERE t.isArchived = false AND LOWER(c.name) IN :names")
    List<Todo> findAllActiveByCategoryNames(@Param("names") List<String> lowercaseNames);
}