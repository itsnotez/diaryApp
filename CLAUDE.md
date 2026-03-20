# MindLog - Diary App

Personal diary application with mood tracking and weather integration.

## Tech Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`) + Vite 7 + Tailwind CSS 4 + Pinia + Vue Router
- **Backend:** Spring Boot 4.0.2 + Java 17 + Spring Data JPA + PostgreSQL + Gradle
- **Weather API:** Open-Meteo (free, no key required)

## Project Structure

```
frontend/              # Vue 3 SPA
  src/
    views/             # DiaryList.vue (calendar), DiaryWrite.vue (entry form)
    stores/diary.js    # Pinia store (CRUD actions, currently in-memory mock data)
    router/index.js    # Routes: / (list), /write (new), /write/:id (edit)
    utils/weather.js   # Open-Meteo API integration
    components/        # Reusable UI components
backend/               # Spring Boot API
  src/main/java/com/mindlog/backend/
    domain/diary/
      entity/Diary.java              # JPA entity
      controller/DiaryController.java # REST endpoints
      repository/DiaryRepository.java # Data access
    config/SecurityConfig.java        # Spring Security (permissive for dev)
  src/main/resources/application.yml  # DB & server config
```

## Dev Commands

### Frontend (`frontend/`)

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

### Backend (`backend/`)

```bash
./gradlew bootRun   # Spring Boot at http://localhost:8080
./gradlew build     # Build JAR
./gradlew test      # Run tests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diaries` | List all user diaries |
| POST | `/api/diaries` | Create diary entry |
| GET | `/api/diaries/{id}` | Get single diary |

Base URL: `http://localhost:8080`. CORS configured for `http://localhost:5173`.

## Data Model

Diary entry fields: `id`, `userId`, `content` (TEXT), `moodScore` (1-5), `weather` (sunny/cloudy/rainy/snowy/windy), `temperature` (°C), `location`, `createdAt`.

## Development Notes

- Frontend currently uses Pinia mock store (not connected to backend API yet)
- Backend DB credentials are hardcoded in `application.yml` (postgres/password, localhost:5432/mindlog)
- Spring Security is fully permissive — no auth implemented yet
- Hibernate DDL mode is `update` (auto-creates/alters tables)
- Styling: Tailwind utility-first, dark mode via `dark:` prefix, mobile-first responsive
