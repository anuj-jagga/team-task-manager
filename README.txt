TEAM TASK MANAGER (FULL-STACK)
==============================

A collaborative full-stack workspace application built to manage projects, assign tasks, and track workflow progress. Featuring role-based permission control (Admin and Member), metrics dashboards, and responsive Kanban boards.

1. KEY FEATURES
---------------------------------------------
- Authentication & Authorization: Secure signup/login using JSON Web Tokens (JWT) and bcryptjs.
- Dashboard Overview: Metrics overview tracking total tasks, tasks in progress, completed progress percentages, and overdue tasks. Shows user-assigned tasks and active project scopes.
- Project Management: Partition tasks by projects. Admins can create and delete projects; Members can view all projects in the workspace.
- Kanban Task Board: Grid layout displaying tasks by status: "To Do", "In Progress", and "Done". Support for due date warning, assignee updating, and task deletion.
- Database Seeding: Built-in 1-click database seeding endpoint to create sample users, projects, and tasks for quick evaluation.

2. TECH STACK
---------------------------------------------
- Backend: Node.js + Express
- Database: MongoDB (via Mongoose schemas with validation constraints and model relations)
- Frontend: React + Vite + Tailwind CSS (v4)
- Icons: Lucide React
- Deployment: Configured for single-service container deployment on Railway

3. DATABASE SCHEMAS
---------------------------------------------
- User: Name, Email (validated, unique), Password (hashed), Role (Admin/Member)
- Project: Name, Description, CreatedBy (ObjectId ref User)
- Task: Title, Description, Status (To Do, In Progress, Done), DueDate, Project (ObjectId ref Project), AssignedTo (ObjectId ref User)

4. LOCAL SETUP GUIDE
---------------------------------------------
Prerequisites:
- Node.js (v18+ recommended)
- MongoDB running locally (mongodb://localhost:27017) or a MongoDB Atlas URI.

Installation & Execution:
1. Clone or extract the project repository.
2. Open terminal in the project root directory.
3. Run the installation script to fetch dependencies for both backend and frontend:
   Command: npm run install-all
4. Run the development command to start backend API server (port 5000) and frontend Vite server (port 5173 with proxy configured) concurrently:
   Command: npm run dev
5. Open your browser and navigate to: http://localhost:5173

5. SEEDING & CREDENTIALS
---------------------------------------------
To test the application quickly, click the "Seed Initial Data" button on the Login/Register screen. This will initialize:
- Admin account: admin@taskmanager.com / admin123
- Member accounts:
  * anuj@taskmanager.com / member123 (Anuj Jagga)
  * john@taskmanager.com / member123 (John Doe)
- Projects: 2 sample projects ("VibeCheck Web App" and "Railway Deployment Automation")
- Tasks: 4 sample tasks with different assignments, due dates, statuses, and overdue constraints.

6. RAILWAY DEPLOYMENT INSTRUCTIONS
---------------------------------------------
The application is structured to run as a single-service app where the Node/Express backend serves the compiled React frontend statically.

1. Create a new service on Railway and link this GitHub repository.
2. In the Service Settings, add the following Environment Variables:
   - MONGODB_URI: Connect to a Railway MongoDB plugin database or external Atlas string.
   - JWT_SECRET: A secure custom token string (e.g., supersecretkey).
   - PORT: 5000 (or leave blank; Railway will bind it automatically).
3. Under the Build settings:
   - The build command is "npm run build", which triggers Vite's compilation under /frontend/dist.
   - The start command is "npm start", which boots up server.js using Node.js.
4. Railway will automatically deploy the app. Your backend endpoints and frontend client will run together securely!
