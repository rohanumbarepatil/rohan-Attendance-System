# College Attendance Management System (CAMS)

A production-ready attendance management platform for colleges migrated to a robust **Spring Boot 3 + MySQL** architecture with a **React + Vite** frontend.

```
frontend/   React 18 + Vite SPA          -> deployed via Vercel / Netlify / VPS
backend/    Spring Boot 3.x REST API     -> deployed via Docker / Railway / Render / VPS
docker-compose.yml                       -> full local stack deployment
```

## Features
- **RBAC** (`ADMIN`, `FACULTY`, `STUDENT`) enforced via Spring Security & JWT Filters.
- Admin master-data CRUD, assignments, live attendance monitor, settings, announcements.
- Faculty lecture-wise marking (P/A/L/ML/AL), transactional duplicate prevention, audited edits, live defaulter tracking.
- Student live dashboards, subject/monthly/date-wise views.
- **WebSockets / STOMP** for Realtime updates (Dashboard stats, live notifications).
- **Reports generated 100% client-side** (jsPDF + SheetJS) and downloaded directly in the browser.
- Relational Database Management with **MySQL 8**.

---

# Manual Setup Required

This section explains everything you need to configure manually before running the project.

## 1. MySQL Setup

The application uses MySQL 8 as its primary relational database. You must install MySQL and configure a database schema and user.

**Step-by-Step Instructions:**
1. Install MySQL Server 8.0+.
2. Open your MySQL terminal or client (e.g., MySQL Workbench).
3. Execute the following SQL commands to create the database and assign privileges:

```sql
-- Create the database
CREATE DATABASE cams;

-- Create the dedicated user for the application
CREATE USER 'cams_user'@'%' IDENTIFIED BY 'cams_password';

-- Grant all privileges to the user on the created database
GRANT ALL PRIVILEGES ON cams.* TO 'cams_user'@'%';

-- Apply the privilege changes
FLUSH PRIVILEGES;
```

## 2. Environment Variables

You must configure the following environment variables for both the backend and frontend.

### Frontend Variables (`frontend/.env`)
Create a `.env` file in the `frontend` directory:

| Name | Description | Required | Example Value |
|---|---|---|---|
| `VITE_API_URL` | Base URL for the Spring Boot REST API | Yes | `http://localhost:8080/api` |

### Backend Variables (`backend/src/main/resources/application.yml` or exported via OS)

| Name | Description | Required | Example Value |
|---|---|---|---|
| `PORT` | The port the backend runs on | Optional | `8080` |
| `DB_HOST` | MySQL Server host | Yes | `localhost` |
| `DB_PORT` | MySQL Server port | Optional | `3306` |
| `DB_NAME` | MySQL Database name | Yes | `cams` |
| `DB_USER` | MySQL Username | Yes | `cams_user` |
| `DB_PASSWORD` | MySQL Password | Yes | `cams_password` |
| `JWT_SECRET` | 64-character minimum secret for signing JWTs | Yes | `your-very-secure-64-character-jwt-secret-string-here` |
| `JWT_ACCESS_MINUTES` | Access token expiration | Optional | `30` |
| `JWT_REFRESH_DAYS` | Refresh token expiration | Optional | `7` |
| `FRONTEND_ORIGINS` | Allowed CORS origins | Yes | `http://localhost:5173` |
| `FRONTEND_URL` | Used for email links | Yes | `http://localhost:5173` |
| `SMTP_HOST` | SMTP server for emails | Optional | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | Optional | `587` |
| `SMTP_USER` | SMTP Username | Optional | `no-reply@college.edu` |
| `SMTP_PASSWORD` | SMTP Password | Optional | `smtp-app-password` |

## 3. First Admin Setup

A first admin user must be created directly in the MySQL database so you can log into the system for the first time.

1. Ensure the backend has been run at least once so Hibernate can generate the `users` table.
2. Execute the following SQL command in your MySQL terminal:

```sql
INSERT INTO users (created_at, updated_at, active, display_name, email, email_verified, password, role) 
VALUES (NOW(), NOW(), 1, 'System Admin', 'admin@college.edu', 1, '$2a$10$D8bT0XJ/G4H5G6yA6X/m1uGz2A.6/q3q5y9k1w3q5y9k1w3q5y9k', 'ADMIN');
```
*Note: The password hash above corresponds to the default password: `Admin@123`. You must change it immediately upon login.*

**Default Credentials:**
- **Email:** `admin@college.edu`
- **Password:** `Admin@123`

## 4. Application Startup

### Frontend Startup
1. Open a terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Startup
1. Open a terminal and navigate to the `backend` folder.
2. The backend requires JDK 21. If your system uses JDK 25 (which has a known incompatibility with Lombok), run the included PowerShell script which will safely download an isolated JDK 21 instance and run the application.
3. Start the application:
   ```powershell
   .\start-backend.ps1
   ```
   *(If you prefer to run it manually and have JDK 21 installed, use `mvn clean install -DskipTests` followed by `mvn spring-boot:run`)*

## 5. Production Deployment

### Frontend Deployment
The frontend is a static React Single Page Application (SPA).
1. Build the application: `npm run build`.
2. The output in the `dist` folder can be hosted on Vercel, Netlify, AWS S3, or Nginx.
3. Configure your hosting provider to redirect all 404s to `index.html` (Client-side routing).

### Backend Deployment
The backend is a Spring Boot Java application.
1. Build the executable `.jar` file: `mvn clean package -DskipTests`.
2. The generated jar in `target/cams-backend-1.0.0.jar` can be run via `java -jar cams-backend-1.0.0.jar`.
3. You can deploy this artifact to platforms like Render, Railway, AWS Elastic Beanstalk, or a standalone VPS.
4. Alternatively, use the provided `Dockerfile` to containerize the application.

### Database Deployment
1. Host a MySQL 8 database instance (e.g., AWS RDS, DigitalOcean Managed DB).
2. Ensure the backend environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`) point to your production database URL.

## 6. Manual Configurations

The following configurations cannot be generated automatically and must be secured manually in production:

* **Database credentials:** Never commit `DB_USER` or `DB_PASSWORD` to source control.
* **JWT Secret:** Generate a cryptographically secure 64-character string. Do not use the default.
* **SMTP Credentials:** Set up an App Password or API key via your email provider (e.g., Gmail, SendGrid, SES).
* **Environment Variables:** Provide these securely via your hosting provider's dashboard (e.g., Vercel Environment Variables, Render Secrets).
* **Domain names:** Set `FRONTEND_ORIGINS` in your backend strictly to your production domain to secure CORS.

## 7. Production Checklist

- [ ] MySQL Installed
- [ ] Database Created
- [ ] Environment Variables Configured
- [ ] JWT Secret Added (Cryptographically secure)
- [ ] SMTP Configured
- [ ] First Admin Created (Database seeded)
- [ ] Default Admin Password Changed after initial login
- [ ] Frontend Running (Vite/Nginx)
- [ ] Backend Running (Spring Boot)
- [ ] WebSockets proxy configured in Nginx (if applicable)
- [ ] Deployment Completed
