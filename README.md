# TaskMaster - Real-Time Collaborative Task Manager

A comprehensive, full-stack task management application built to facilitate seamless collaboration. It features real-time updates, secure authentication, role-based task management, and a premium "Aurora" design system.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom "Aurora" Theme + Glassmorphism)
- **State Management**: 
  - **React Query** (Server State, Caching, Optimistic Updates)
  - **Context API** (Auth, Toast Notifications)
- **Forms**: React Hook Form + Zod
- **Real-Time**: Socket.io Client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) + BCrypt (Password Hashing)
- **Real-Time**: Socket.io
- **Testing**: Jest

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Atlas)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   *Server will run on port 5000.*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file if you blocked port 5000:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
   *Application will run on http://localhost:5173.*

---

## 📡 API Contract Documentation

### Remote Base URL
Local: `http://localhost:5000/api`
Production: `https://ablespace-2rbl.onrender.com/api`

### 1. Authentication (`/auth`)
| Method | Endpoint    | Description                          | Payload |
|:-------|:------------|:-------------------------------------|:--------|
| POST   | `/register` | Register a new user                  | `{ name, email, password }` |
| POST   | `/login`    | Log in and receive JWT               | `{ email, password }` |

### 2. Tasks (`/tasks`)
*All endpoints require `Authorization: Bearer <token>` header.*

| Method | Endpoint      | Description                          | Payload/Params |
|:-------|:--------------|:-------------------------------------|:---------------|
| POST   | `/`           | Create a new task                    | `{ title, description, dueDate, priority, assignedToId }` |
| GET    | `/`           | Get all tasks (supports filtering)   | Query Params: `?status=IN_PROGRESS&priority=HIGH` |
| GET    | `/:id`        | Get details of a specific task       | - |
| PATCH  | `/:id`        | Update a task (Creator/Assignee only)| `{ status, updates... }` |
| DELETE | `/:id`        | Delete a task (Creator only)         | - |

---

## 🏗️ Architecture Overview & Design Decisions

### Backend: Service-Controller-Repository Pattern
We adopted a layered architecture to ensure scalability and separation of concerns:
1.  **Repository Layer**: Handles direct MongoDB queries. This isolates the database logic, allowing us to switch ORMs or databases easily if needed.
2.  **Service Layer**: Contains the **Business Logic**. This is where we validate rules (e.g., "Only the creator can delete"), generate Audit Logs, and emit **Socket.io events**.
3.  **Controller Layer**: Handles incoming HTTP requests, validates DTOs (Data Transfer Objects), and sends responses.

### 🔐 Authentication Strategy
- **JWT (JSON Web Tokens)**: We use stateless authentication to scale easily.
- **Middleware**: A custom `authMiddleware` intercepts protected requests, validates the signature, and attaches the `user` object to the request.

### ⚡ Real-Time Integration (Socket.io)
Instead of polling the server every few seconds, we implemented a push-based architecture:
1.  **Event Emission**: When the `TaskService` performs an action (Create, Update, Delete), it immediately emits an event (e.g., `task:updated`) using the global `io` instance.
2.  **Targeted Notifications**: We use Socket.io "Rooms". Each user joins a room named after their `userId`. When a task is assigned, we emit specifically to that room (`io.to(userId).emit('task:assigned')`), triggering a personal notification.
3.  **Frontend reaction**: The frontend uses a `useSocket` hook. Upon receiving an event, it calls `queryClient.invalidateQueries()`. This cues React Query to re-fetch the fresh data automatically, keeping the UI perfectly in sync.

---

## 📝 Trade-offs & Assumptions

1.  **Audit Log Implementation**: 
    *   *Decision*: We implemented a basic "Fire and Forget" audit log.
    *   *Trade-off*: If logging fails, the transaction still succeeds. In a banking app, we would use transactions to ensure consistency, but here user experience/speed was prioritized.
    
2.  **Pagination**:
    *   *Assumption*: The number of active tasks per user will remain manageable (< 1000). 
    *   *Trade-off*: We currently fetch "all tasks" and filter/sort on the client for instant responsiveness ("My Tasks", "Overdue"). As the dataset grows, we would need to implement server-side pagination.

3.  **Optimistic Updates**:
    *   *Decision*: We use React Query's `onMutate` to update the UI *before* the server responds.
    *   *Benefit*: The app feels incredibly fast.
    *   *Risk*: If the server fails, the UI must "rollback". We handle this in the `onError` callback.

---

## 🧪 Running Tests
The backend includes a suite of unit tests for the Service layer using **Jest**.

```bash
cd backend
npm run test
```

### Author
**Kunal Raj**

