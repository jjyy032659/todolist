# Todo List

A full-stack todo application. A Spring Boot REST API stores tasks and the categories they
belong to in MySQL, and a React + TypeScript frontend consumes it.

Built as a training project for the _nology Australia course.

## Repository layout

```
todolist/
├── src/                Spring Boot API (Java)
├── pom.xml             API build file
├── mvnw, mvnw.cmd      Maven wrapper — no separate Maven install needed
└── todos-ui/           React + TypeScript frontend (Vite)
```

The two run as separate processes: the API on port 8080, the UI dev server on 5173.

## Tech stack

**API** — Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA, Bean Validation,
Hibernate 7, MySQL 8, springdoc-openapi (Swagger UI). Tested with JUnit 5, MockMvc and H2.

**Frontend** — React 19, TypeScript, Vite, TanStack Query, Axios, React Hook Form,
Tailwind CSS. Tested with Vitest and React Testing Library. Linted with oxlint.

## Running it

You need Java 17+, MySQL 8 and Node 20+.

### 1. Database

Create the schema. The tables are generated on first run, so nothing else is needed:

```sql
CREATE DATABASE todos_db;
```

### 2. API

Set your MySQL credentials in `src/main/resources/application.properties`, then from the
repository root:

```bash
./mvnw spring-boot:run
```

On Windows outside Git Bash use `.\mvnw.cmd spring-boot:run`.

If port 8080 is already taken, override it:

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

Check it is up — an empty database returns `[]`:

```bash
curl localhost:8080/categories
```

Interactive API docs: <http://localhost:8080/swagger-ui.html>

### 3. Frontend

In a second terminal:

```bash
cd todos-ui
npm install
npm run dev
```

Then open <http://localhost:5173>.

The Vite dev server proxies `/api/*` through to `http://localhost:8080`, so the browser only
ever talks to one origin during development. To point the frontend somewhere else, set
`VITE_API_BASE_URL`. The API also has CORS configured for `localhost:5173` and
`localhost:3000` for the case where the proxy is bypassed.

## API reference

| Method | Path | Success | Notes |
|--------|------|---------|-------|
| GET | `/categories` | 200 | |
| POST | `/categories` | 201 | 400 if `name` is blank |
| PATCH | `/categories/{id}` | 200 | 404 if not found |
| DELETE | `/categories/{id}` | 204 | 404 if not found |
| GET | `/todos` | 200 | archived todos excluded |
| GET | `/todos?category=Work` | 200 | repeat the param to filter on several categories; matching is case-insensitive |
| GET | `/todos/{id}` | 200 | 404 if missing **or archived** |
| POST | `/todos` | 201 | 400 if `title` is blank, 404 if `categoryId` does not exist |
| PATCH | `/todos/{id}` | 200 | partial update — omitted fields are left alone |
| DELETE | `/todos/{id}` | 204 | soft delete — sets `isArchived = true` |

Creating a todo:

```json
POST /todos
{ "title": "Buy milk", "isComplete": false, "categoryId": 2 }
```

The response nests the category, so the client can render the category name without a
second request:

```json
{
  "id": 1,
  "title": "Buy milk",
  "isComplete": false,
  "category": { "id": 2, "name": "Home" }
}
```

Partial update — send only what changes:

```json
PATCH /todos/1
{ "isComplete": true }
```

## Design notes

### Two tables, one foreign key

Categories live in their own table and each todo holds a `category_id` foreign key
(`@ManyToOne`). Storing the category name on every todo instead would mean a rename has to
update every matching row, nothing would stop near-duplicate names like `work` and `Work`,
and a category with no tasks yet could not exist at all.

### DTOs and the mapper

Entities never leave the service layer — each one is converted to a response record by a
mapper first. This keeps the database schema and the API contract independent.

`Todo` has an `isArchived` field; `TodoResponse` does not, and `TodoMapper` simply never
copies it. The soft-delete flag therefore cannot leak to the client, and adding a column to
the entity later does not silently publish it.

It also avoids a concrete failure: `category` is fetched lazily, so returning the entity
directly would hand Jackson an unresolved Hibernate proxy.

Request and response DTOs are separate for the same reason POST and PATCH are separate.
`CreateTodoDto` requires a title; `UpdateTodoDto` allows every field to be null, because in
a partial update null means "leave this alone".

### Soft delete

`DELETE /todos/{id}` sets `isArchived = true` rather than removing the row. Every read path
respects the flag — `findAllActive()` and `findActiveById()` both filter on it — so an
archived todo disappears from the list and returns 404 by id, indistinguishable from one
that never existed.

### Avoiding N+1 queries

Todo queries use `JOIN FETCH` to load each todo's category in the same query. Without it,
listing N todos costs N+1 queries, because the mapper touches `getCategory()` on every item
and each lazy proxy resolves separately.

### Frontend data layer

TanStack Query owns all server state — fetching, caching and invalidation after mutations —
so no todo or category list is duplicated in component state. Axios calls are wrapped in
`useTodos` and `useCategories`, keeping HTTP out of the components entirely.

Filtering is handled by the API rather than in the browser: selecting categories re-queries
`GET /todos?category=…`, which keeps the client and server agreeing on what "filtered" means.

## Project structure

```
src/main/java/com/example/demo/
├── model/        Category, Todo — JPA entities
├── repository/   Spring Data interfaces + JOIN FETCH queries
├── dto/          request and response records
├── mapper/       entity → response DTO
├── service/      business logic: PATCH rules, soft delete, category lookup
├── controller/   HTTP layer only
├── exception/    NotFoundException + @RestControllerAdvice
└── config/       CORS for the frontend dev server

todos-ui/src/
├── api/          axios client, typed endpoint wrappers, shared types
├── hooks/        useTodos, useCategories — TanStack Query wrappers
├── components/   Header, CategoryManager, CategoryFilter, SummarySection,
│                 TodoForm, TodoList, TodoItem, CategoryBadge, ErrorBanner
└── lib/          category colour assignment, constants
```

## Tests

API:

```bash
./mvnw test
```

Tests run against an in-memory H2 database configured in
`src/test/resources/application.properties`, so the development database is never touched and
every run starts from an empty schema. Coverage focuses on behaviour that could break
silently: validation returning 400, unknown ids returning 404, the create → GET → DELETE →
GET cycle that proves soft delete, and filtering by category.

Frontend:

```bash
cd todos-ui
npm test
```

Component tests with Vitest and React Testing Library cover the category manager, the
category filter, the summary section and the todo form.

### A note on Rest Assured

The brief suggested Rest Assured, and it was the first choice. On Spring Boot 4 only POST
requests worked — GET, DELETE and PATCH all threw a `NullPointerException` inside Rest
Assured's own Groovy internals, regardless of content type or HTTP client configuration. The
same requests succeeded through curl and Swagger, so the API itself was fine.

The tests use MockMvc instead. Spring Boot 4 also moved the annotation, which is worth
knowing if you hit the same thing:
`org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc`.

## Requirements covered

**API** — categories and todos in separate tables, all nine endpoints, plus both bonuses:
filtering `GET /todos` by one or more categories, and soft delete via an `isArchived` flag
that hides archived todos from the list and returns 404 by id.

**Frontend** — add categories, add tasks tagged with a category, update a task's name and
category, delete tasks, custom styling. Bonuses: full category management (rename and
delete), a summary section counting tasks per category, a category filter, and a cap on the
number of categories.

## Known limitations

- Creating a category whose name already exists returns 500 rather than 409. The unique
  constraint is enforced by MySQL, but the service does not check for the clash first.
- Deleting a category that still has todos attached returns 500 from the foreign key
  constraint rather than a 409 explaining the conflict.
- Error responses are plain text, not a structured JSON body. Only `NotFoundException` has a
  handler; everything else falls through to Spring's default error response.
- Database credentials live in `application.properties` and should move to an environment
  variable.
