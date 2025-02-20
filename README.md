# Simple Task API

## 📌 Overview
Simple Task API is a task management system built using **Node.js**, **Express.js**, and **MongoDB**. It supports **user authentication**, **task creation**, **editing**, **deletion**, and **searching tasks**.

---

## 🚀 Features
✅ User authentication (Register, Login, JWT-based authentication)  
✅ CRUD operations for tasks (Create, Read, Update, Delete)  
✅ Search tasks by title and status  
✅ Role-based access control (User/Admin)  
✅ Middleware for authentication & authorization  

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/simple-task-api.git
   cd simple-task-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file and add the following:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://your_mongo_url
     TOKEN_KEY=your_secret_key
     ```

4. **Run the server**
   ```bash
   npm run dev
   ```

---

## 🔑 API Endpoints

### 1️⃣ Authentication
| Method | Endpoint      | Description       |
|--------|-------------|------------------|
| POST   | `/register` | Register a new user |
| POST   | `/login`    | Login and receive a JWT token |
| POST   | `/logout`    | Logout |

### 2️⃣ Task Management
| Method | Endpoint       | Description               |
|--------|--------------|--------------------------|
| GET    | `/allTask`      | Get all tasks            |
| POST   | `/insertTask`      | Create a new task        |
| GET    | `/:id`  | Get a specific task by ID |
| PUT    | `/updateTask/:id`  | Update a task by ID      |
| DELETE | `/deleteTask/:id`  | Delete a task by ID      |

### 3️⃣ Task Search
| Method | Endpoint       | Description                    |
|--------|--------------|-------------------------------|
| GET    | `/searchTask?title=abc&status=pending` | Search tasks by title & status |

---

## 🛡️ Middleware
- **Authentication Middleware**: Protects private routes (`Auth.tokenVerify`)
- **Role-based Middleware**: Restricts actions for Admin users (`Auth.adminVerify`)

---

## 📌 Author
**[Your Name]**  
📌 GitHub: [yourusername](https://github.com/yourusername)  
📌 Email: your@email.com  

---

## 🎯 Next Steps
- [ ] Add unit tests
- [ ] Implement task due dates
- [ ] Improve error handling

