# Three-tier Node.js application with Docker


## Project structure

```
three-tier-nodejs-docker/
├─ docker-compose.yml
├─ .env
├─ .dockerignore
├─ README.md
├─ frontend/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ index.js
│  └─ public/
│     └─ index.html
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ index.js
│  ├─ db.js
│  └─ .env.example
└─ postgres-init/
   └─ init.sql
```

---


# Three-Tier Node.js Application (Frontend + Backend + PostgreSQL) with Docker

This project demonstrates a complete **three-tier architecture** consisting of:
- **Frontend** (Node.js + Express serving static HTML)
- **Backend** (Node.js + Express REST API)
- **Database** (PostgreSQL)

It is fully containerized with **Docker Compose**, but you can also run it **without Docker** on your local system.

---

# 🧱 Project Architecture

A standard 3-tier structure:

## 1️⃣ Presentation Layer — Frontend
- A lightweight Express server
- Serves HTML from `/public`
- Communicates with backend through API calls or proxy (`/proxy/items`)

## 2️⃣ Application Layer — Backend
- Node.js Express REST API
- Handles routes:
  - `GET /api/items`
  - `POST /api/items`
- Uses PostgreSQL for data persistence

## 3️⃣ Data Layer — PostgreSQL
- Runs in its own container
- Auto‑initialized with SQL from `postgres-init/init.sql`
- Stores data in Docker named volume `db_data`

---

# 🛠️ How The Project Was Built

## ✔ Backend
- Express server created in `backend/index.js`
- Database connection via `pg` module in `db.js`
- Dockerfile built using `node:20-alpine`
- Environment variables injected using `.env.example`

## ✔ Frontend
- Express server in `frontend/index.js`
- Static HTML UI in `public/index.html`
- Proxy route prevents CORS when inside Docker

## ✔ Database
- PostgreSQL 15 image
- Automatic SQL migration using `docker-entrypoint-initdb.d`

## ✔ Docker Compose
- All three services defined under `services:`
- Internal DNS names used for communication (`backend`, `db`)

---

# 🚀 Running This Application With Docker

### Prerequisites
- Docker Desktop installed

### Start all services
```bash
docker compose up --build
````

### Access URLs

| Service      | URL                                                                |
| ------------ | ------------------------------------------------------------------ |
| Frontend     | [http://localhost:8080](http://localhost:8080)                     |
| Backend      | [http://localhost:3000/api/items](http://localhost:3000/api/items) |
| Health Check | [http://localhost:3000/health](http://localhost:3000/health)       |
| PostgreSQL   | localhost:5432                                                     |

### Stop services

```bash
docker compose down
```

Delete DB volume (⚠ irreversible):

```bash
docker compose down -v
```

---

# 🧩 Understanding Docker Compose (Important Concepts)

## **1. docker-compose.yml structure**

```yaml
services:
  backend:
    build: ./backend
```

Each service becomes one container.

## **2. Ports Mapping — `HOST:CONTAINER`**

```yaml
"3000:3000"
```

Left → your laptop, Right → container.

## **3. Environment Variables**

```yaml
environment:
  - DATABASE_USER=${POSTGRES_USER:-appuser}
```

Meaning:

* If `POSTGRES_USER` exists → use that
* Else → default to `appuser`

### How Node.js reads env vars:

```js
process.env.DATABASE_USER
```

## **4. Volumes**

```yaml
volumes:
  db_data:
```

A **named Docker volume**, *not* a folder on your host.

Postgres uses it here:

```yaml
- db_data:/var/lib/postgresql/data
```

## **5. depends_on**

Ensures backend starts after DB.

```yaml
depends_on:
  - db
```

---

# 🌱 How Env Variables Work Across App

## Backend Example

In compose:

```yaml
environment:
  - DATABASE_HOST=db
```

Inside backend:

```js
host: process.env.DATABASE_HOST
```

## Frontend Example

```yaml
environment:
  - API_URL=http://backend:3000
```

Used inside frontend:

```js
const API_URL = process.env.API_URL;
```

---

# 🧑‍💻 Run This Project WITHOUT Docker

## 1️⃣ Install dependencies

* Node.js (18+)
* PostgreSQL

## 2️⃣ Setup PostgreSQL manually

```bash
createdb appdb
createuser appuser --pwprompt
psql -U appuser -d appdb -f postgres-init/init.sql
```

## 3️⃣ Run Backend locally

```bash
cd backend
npm install
npm start
```

Backend → [http://localhost:3000](http://localhost:3000)

## 4️⃣ Run Frontend locally

```bash
cd frontend
npm install
export API_URL=http://localhost:3000
npm start
```

Frontend → [http://localhost:8080](http://localhost:8080)

---

# 🔄 How the Application Works Internally

### ➤ User requests frontend page (port 8080).

### ➤ Frontend fetches items from backend via proxy.

### ➤ Backend queries PostgreSQL using pg module.

### ➤ PostgreSQL returns rows.

### ➤ Backend sends JSON response.

### ➤ Frontend displays the data.

Same workflow works:

* inside Docker → using internal DNS (`backend`, `db`)
* outside Docker → using `localhost`

---

# 🛠 Helpful Docker Commands

| Command                          | Description           |
| -------------------------------- | --------------------- |
| `docker compose up`              | Start services        |
| `docker compose up --build`      | Rebuild + start       |
| `docker compose down`            | Stop services         |
| `docker compose down -v`         | Delete volume         |
| `docker volume ls`               | List volumes          |
| `docker logs backend`            | View backend logs     |
| `docker exec -it <container> sh` | Enter container shell |

---

# 🎉 Final Notes

* Fully functional 3-tier architecture
* Dockerized + local non-Docker support
* Good for DevOps, Docker, Node.js practice
* Environment variables and networking clearly demonstrated

If you want, I can additionally create:

* A zipped download folder
* Kubernetes manifests
* GitHub Actions CI/CD workflow
* Makefile for easier commands

Just tell me! 🚀

````md
# Three-Tier Node.js Application (Frontend + Backend + PostgreSQL) with Docker

This project demonstrates a real-world **three-tier architecture** built using **Node.js**, **Express.js**, and **PostgreSQL**, fully containerized with **Docker Compose**. It also supports running outside Docker for local development.

---
## 🧱 Architecture Overview

A classic 3‑tier architecture:

### **1. Presentation Layer (Frontend)**
- A simple Node.js/Express server serving static HTML (in `/frontend/public`).
- Makes API calls to backend.
- The frontend container communicates with backend using Docker's internal DNS name: `http://backend:3000`.

### **2. Application Layer (Backend)**
- Express.js API.
- Handles CRUD operations.
- Connects to PostgreSQL using environment variables.

### **3. Database Layer (PostgreSQL)**
- PostgreSQL 15 running inside a container.
- Auto‑initializes using SQL script provided in `postgres-init/init.sql`.

---
## 📦 How This Project Was Built

### ✔ Step 1 — Backend Setup
- Created `backend/index.js` with Express routes.
- Added DB connection via `pg` module.
- Added environment variables to `.env.example`.
- Built `backend/Dockerfile`.

### ✔ Step 2 — Frontend Setup
- Simple Express server serving `public/index.html`.
- Added a proxy route (`/proxy/items`) to call backend.
- Built `frontend/Dockerfile`.

### ✔ Step 3 — Database Initialization
- Created SQL schema in `postgres-init/init.sql`.
- Docker Compose automatically executes it on first DB startup.

### ✔ Step 4 — Docker Compose
- Defined 3 services: **db**, **backend**, **frontend**.
- Connected them with Docker internal networking.
- Created named volume `db_data` to persist PostgreSQL data.

---
## 🚀 Running the Application Using Docker

### **Prerequisites**
- Docker Desktop installed on your system (Mac/Windows/Linux).

### **Start all services**
```bash
docker compose up --build
````

### **URLs**

| Layer          | URL                                                                |
| -------------- | ------------------------------------------------------------------ |
| Frontend       | [http://localhost:8080](http://localhost:8080)                     |
| Backend API    | [http://localhost:3000/api/items](http://localhost:3000/api/items) |
| Backend Health | [http://localhost:3000/health](http://localhost:3000/health)       |
| PostgreSQL     | localhost:5432 (mapped from container)                             |

### **Stopping Everything**

```bash
docker compose down
```

If you want to delete database volume (⚠ removes all data):

```bash
docker compose down -v
```

---

## 🔍 How Docker Compose Works (Explained Simply)

### 📌 **Key Concepts**

### **1. Services**

Each `service:` in docker-compose represents a container.
Example:

```yaml
backend:
  build: ./backend
  ports:
    - "3000:3000"
```

This builds and runs the backend container.

### **2. Ports Syntax — `HOST:CONTAINER`**

```yaml
"3000:3000"
```

* Left side (host): your laptop.
* Right side (container): inside Docker.

### **3. Volumes**

```yaml
volumes:
  db_data:
```

This is a **named volume**, managed by Docker—not a folder on your system.

Postgres stores its DB files here:

```yaml
- db_data:/var/lib/postgresql/data
```

### **4. Environment Variables**

Example from backend:

```yaml
environment:
  - DATABASE_HOST=db
```

Docker Compose injects these variables inside the container.

Backend accesses them using:

```js
process.env.DATABASE_HOST
```

### **5. depends_on**

```yaml
depends_on:
  - db
```

This ensures backend starts **after** the database container.

---

## 🌍 How Environment Variables Work Here

### **Backend Example**

In `docker-compose.yml`:

```yaml
environment:
  - DATABASE_USER=${POSTGRES_USER:-appuser}
```

Meaning:

* If `POSTGRES_USER` is set on the host → use it.
* Else → default to `appuser`.

Inside backend, this is read via:

```js
const user = process.env.DATABASE_USER;
```

### **When using `.env.example`**

```yaml
env_file:
  - ./backend/.env.example
```

Compose automatically loads the variables into the backend container.

---

## 🧑‍💻 Running the Project WITHOUT Docker

You can also run everything manually.

### **1. Install Requirements**

* Node.js (v18+)
* PostgreSQL (v14+)

### **2. Start PostgreSQL Locally**

```bash
createdb appdb
createuser appuser --pwprompt
```

Run SQL schema:

```bash
psql -U appuser -d appdb -f postgres-init/init.sql
```

### **3. Run Backend Locally**

```bash
cd backend
npm install
npm start
```

Backend runs at:

```
http://localhost:3000
```

### **4. Run Frontend Locally**

```bash
cd frontend
npm install
export API_URL=http://localhost:3000
npm start
```

Frontend runs at:

```
http://localhost:8080
```

---

## 🧠 How the Application Works Internally

### **Flow of a user request:**

1. User opens `http://localhost:8080` (frontend).
2. Frontend calls backend via proxy → `/proxy/items`.
3. Backend reads request → queries PostgreSQL.
4. Postgres returns rows.
5. Backend sends JSON response.
6. Frontend displays it.

This exact flow works both:

* inside Docker → using internal DNS names like `backend` or `db`
* outside Docker → using localhost addresses.

---

## 🛠 Useful Docker Commands

| Command                                 | Purpose             |
| --------------------------------------- | ------------------- |
| `docker compose up`                     | Start all services  |
| `docker compose up --build`             | Rebuild + start     |
| `docker compose down`                   | Stop containers     |
| `docker compose down -v`                | Delete DB data too  |
| `docker volume ls`                      | List named volumes  |
| `docker logs backend`                   | View logs           |
| `docker exec -it three_tier_backend sh` | Enter backend shell |

---

## 🎉 Summary

* This project demonstrates complete **3-tier architecture**.
* Fully Dockerized with `docker-compose.yml`.
* Environment variables are used cleanly and consistently.
* Works both **inside** and **outside** Docker.
* Beginner‑friendly but realistic setup used in real DevOps workflows.

---

Need more?

* Want a zipped folder of the entire project?
* Want Kubernetes (k8s) manifests for this app?
* Want CI/CD pipeline (GitHub Actions or Jenkins)?

Tell me and I’ll add it!

```bash
docker compose up --build
```

3. Visit frontend at [http://localhost:8080](http://localhost:8080)
4. Backend API at [http://localhost:3000/api/items](http://localhost:3000/api/items)

## Notes

* To seed the database only on first run, `postgres-init/init.sql` is used by the official Postgres image.
* For development, use volumes to mount source code and run `npm install` inside container or run services locally.

```

---

If you want, I can:
- produce ready-to-copy file contents for each file as separate downloadable files,
- convert the frontend to React,
- add a Makefile for convenience,
- provide a `dev` docker-compose override with hot reload using volumes.

Tell me which of these you want next and I'll add them.

```
