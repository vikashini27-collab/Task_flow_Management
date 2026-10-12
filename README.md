# TASKFLOW - Task Management System

A modern task and project management platform where users can create, assign, track and complete tasks while monitoring productivity through a visual dashboard.

## 1. Project Structure

```
TASKFLOW/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── api/          # Axios configurations and endpoints
│   │   ├── components/   # Reusable UI components & 3D scenes
│   │   ├── context/      # React Context (Auth)
│   │   ├── pages/        # Main route pages (Dashboard, Login, etc.)
│   │   └── ...
│   ├── package.json
│   ├── tailwind.config.js
│   └── ...
├── backend/              # Spring Boot application
│   ├── src/main/java/com/taskflow/
│   │   ├── config/       # Security & CORS configuration
│   │   ├── controller/   # REST API Endpoints
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities
│   │   ├── exception/    # Error handling
│   │   ├── repository/   # JPA Repositories
│   │   └── security/     # JWT Authentication Filters
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── ...
└── README.md
```

## 2. Technologies Used

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Drei, Recharts, Lucide React, Axios.
**Backend:** Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security, JWT, Hibernate, Maven.
**Database:** H2 Database (Default for easy testing) / MySQL (Supported).

## 3. Database Setup Instructions

The application is currently configured to use an in-memory **H2 Database** so that it runs out-of-the-box without any manual database setup.

**To switch to MySQL:**
1. Ensure MySQL is installed and running on port `3306`.
2. Create a database named `taskflow_db`: `CREATE DATABASE taskflow_db;`
3. In `backend/src/main/resources/application.properties`, uncomment the MySQL configuration section and comment out the H2 section.
4. Update `DB_USERNAME` and `DB_PASSWORD` if necessary.

## 4. How to Start Backend

Navigate to the `backend` directory:
```bash
cd backend
```
Build the project using Maven:
```bash
mvn clean install -DskipTests
# If you don't have Maven installed globally, use the provided wrapper or download maven.
```
Run the Spring Boot application:
```bash
mvn spring-boot:run
# Or run the compiled jar: java -jar target/backend-0.0.1-SNAPSHOT.jar
```
The backend will start on `http://localhost:8080`.

## 5. How to Start Frontend

Navigate to the `frontend` directory:
```bash
cd frontend
```
Install dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## 6. Environment Variables Required

**.env (Backend - optional, can be set in application.properties)**
```
DB_URL=jdbc:mysql://localhost:3306/taskflow_db
DB_USERNAME=root
DB_PASSWORD=yourpassword
JWT_SECRET=super_secret_key_which_should_be_long_enough_for_hmac_sha256_algorithm
```

**.env (Frontend)**
```
VITE_API_URL=http://localhost:8080/api
```

## 7. API Endpoint Summary

**Auth**
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate and receive JWT
- `POST /api/auth/logout`: Logout user

**Tasks**
- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `PATCH /api/tasks/{id}/status`: Update task status
- `DELETE /api/tasks/{id}`: Delete task

**Projects**
- `GET /api/projects`: Get all projects
- `POST /api/projects`: Create project
- `DELETE /api/projects/{id}`: Delete project

**Analytics**
- `GET /api/analytics/dashboard`: Get dashboard statistics

## 8. Presentation & Documentation

An interactive 10-slide HTML presentation with pastel styling, flowcharts, architecture diagrams, and prototype screenshots is available under:
- `docs/taskflow_presentation.html` (open directly in any web browser to view the slides!)
- `docs/dashboard_screenshot.png`
- `docs/login_screenshot.png`

## 9. Features Completed

- [x] **Full-Stack Architecture:** React 18 + Vite frontend paired with Spring Boot 3.2 Java backend
- [x] **JWT Authentication & Spring Security:** Secure register/login flows, BCrypt hashing, and protected routes
- [x] **Pastel Aesthetic & Themes:** Light pastel palette (pink, blue, purple, white) and Dark Navy theme with instant toggle
- [x] **3D Cloud & Celestial Animations:** Running clouds, floating moon, and sparkle particles powered by Three.js & React Three Fiber
- [x] **Task Management (Full CRUD):** Add, Edit, Delete, filter, and mark tasks complete with priorities and deadlines
- [x] **Project Status Kanban:** Organize projects into Not Started, Ongoing, and Completed columns with deadline tracking
- [x] **Smart Deadline Reminders:** Automatic notifications generated on login for deadlines due in 2 days, 1 day, or today
- [x] **Team Collaboration:** Create teams, generate unique invite codes, and join team workspaces
- [x] **Calendar View:** Month view with daily task notes and scheduled items
- [x] **Visual Analytics & Dashboard:** Recharts pie chart, area chart, and summary metric cards linked to real live backend data
- [x] **Settings & Task History:** Theme switcher, test notification generator, and past week/month completed task audit log
- [x] **In-Memory H2 & MySQL Support:** Zero-setup H2 database for immediate testing, easily switchable to MySQL in `application.properties`

