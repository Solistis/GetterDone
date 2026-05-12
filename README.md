# Reminder App

A full-stack reminder and task management web application built with **Node.js**, **Express**, and **PostgreSQL**.

The goal of this project is to create a simple and fast system for managing:
- assignments
- chores
- errands
- reminders
- recurring tasks
- flexible vs urgent activities

This project is designed to be mobile-friendly and easy to use so users can quickly enter reminders from their phone without relying on memory or handwritten notes.

---

# Current Tech Stack

## Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- cors
- nodemon

## Planned Frontend
- HTML/CSS/JavaScript
- Bootstrap or Tailwind CSS
- Responsive mobile-first design

## Planned Features
- User authentication
- Assignment tracking
- Due date reminders
- Recurring chores
- Grocery/location reminders
- Flexible vs urgent tasks
- Mobile-friendly quick-add system
- Push/email notifications
- Docker support
- Deployment

---

# Software Installation

## 1. Install Node.js

Download the LTS version from:

[Node.js Official Website](https://nodejs.org/en?utm_source=chatgpt.com)

After installation, verify it works:

```bash
node -v
npm -v
```

---

## 2. Install PostgreSQL

Download PostgreSQL and pgAdmin from:

[PostgreSQL Downloads](https://www.postgresql.org/download/windows/?utm_source=chatgpt.com)

During installation:
- Install PostgreSQL Server
- Install pgAdmin 4
- Keep default port:
```txt
5432
```

Remember the password you create for the `postgres` user.

---

## 3. Install VS Code

Download Visual Studio Code:

[Visual Studio Code](https://code.visualstudio.com/?utm_source=chatgpt.com)

Recommended extensions:
- ES7+ React/JavaScript Snippets
- PostgreSQL
- DotENV
- Thunder Client or Postman (API testing)

---

# Project Structure

```txt
ReminderApp/
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/
│   │   └── controllers/
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend/
```

---

# Backend Setup

## 1. Initialize Node Project

Inside the backend folder:

```bash
npm init -y
```

This creates:

```txt
package.json
```

---

## 2. Install Dependencies

Install required packages:

```bash
npm install express pg cors dotenv
```

Install development dependency:

```bash
npm install --save-dev nodemon
```

---

# What These Packages Do

| Package | Purpose |
|---|---|
| express | Backend web framework |
| pg | PostgreSQL driver for Node.js |
| cors | Allows frontend/backend communication |
| dotenv | Loads environment variables |
| nodemon | Automatically restarts server during development |

---

# Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=reminder_app
```

---

# Important Security Note

Never upload `.env` to GitHub.

Create a `.gitignore` file:

```gitignore
node_modules/
.env
```

If `.env` was already committed:

```bash
git rm --cached .env
```

---

# Create PostgreSQL Database

Open pgAdmin and create a new database named:

```txt
reminder_app
```

---

# Running the Backend Server

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

If successful, terminal should display:

```txt
Server running on port 4000
```

Visit:

```txt
http://localhost:4000
```

Expected response:

```json
{
  "message": "Reminder app backend running"
}
```

---

# Current Status

✅ Node.js backend initialized  
✅ Express server configured  
✅ PostgreSQL connection setup started  
✅ Environment variable configuration  
✅ Backend folder structure initialized  

---

# Future Goals

- Create task/reminder API routes
- Build responsive frontend
- Add authentication
- Implement notification system
- Add Docker containerization
- Deploy application online

---

# Author

Ariana
