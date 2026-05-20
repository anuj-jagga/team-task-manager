import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AuthScreen from './components/AuthScreen';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import TasksKanbanView from './components/TasksKanbanView';
import { apiFetch } from './services/api';

export default function App() {
  // Token & User Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  // Navigation Tabs
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Workspace Core Data
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // UI state managers
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Forms state managers
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', status: 'To Do', dueDate: '' });

  // Trigger feedback toasts
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load backend data
  const loadData = async () => {
    if (!token) return;
    try {
      const usersData = await apiFetch('/users', token);
      setUsers(usersData);

      const projectsData = await apiFetch('/projects', token);
      setProjects(projectsData);

      if (projectsData.length > 0) {
        // Fallback to first project if none selected
        const currentActiveId = selectedProjectId || projectsData[0]._id;
        if (!selectedProjectId) {
          setSelectedProjectId(currentActiveId);
        }
        const tasksData = await apiFetch(`/projects/${currentActiveId}/tasks`, token);
        setTasks(tasksData);
      } else {
        setTasks([]);
        setSelectedProjectId('');
      }
    } catch (error) {
      if (error.message.includes('Token is invalid') || error.message.includes('expired')) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [token, selectedProjectId]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const body = authMode === 'login' 
        ? { email: authForm.email, password: authForm.password } 
        : authForm;

      const res = await apiFetch(endpoint, null, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      triggerToast(`Welcome back, ${res.user.name}!`);
    } catch (error) {
      triggerToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId('');
    setCurrentTab('dashboard');
    triggerToast('Logged out successfully.');
  };

  // Project Handlers (Admin only)
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/projects', token, {
        method: 'POST',
        body: JSON.stringify(projectForm)
      });
      setProjects([...projects, res]);
      setSelectedProjectId(res._id);
      setProjectForm({ name: '', description: '' });
      setShowProjectModal(false);
      triggerToast('Project created successfully!');
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await apiFetch(`/projects/${id}`, token, { method: 'DELETE' });
      const remaining = projects.filter(p => p._id !== id);
      setProjects(remaining);
      if (selectedProjectId === id) {
        setSelectedProjectId(remaining.length > 0 ? remaining[0]._id : '');
      }
      triggerToast('Project deleted successfully.');
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  // Task Handlers (Admin / Members check)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/projects/${selectedProjectId}/tasks`, token, {
        method: 'POST',
        body: JSON.stringify(taskForm)
      });
      setTasks([...tasks, res]);
      setTaskForm({ title: '', description: '', assignedTo: '', status: 'To Do', dueDate: '' });
      setShowTaskModal(false);
      triggerToast('Task added to Kanban Board!');
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await apiFetch(`/tasks/${taskId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(tasks.map(t => t._id === taskId ? res : t));
      triggerToast(`Task status updated to ${newStatus}!`);
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  const handleUpdateTaskAssignee = async (taskId, newAssigneeId) => {
    try {
      const res = await apiFetch(`/tasks/${taskId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo: newAssigneeId })
      });
      setTasks(tasks.map(t => t._id === taskId ? res : t));
      triggerToast('Task assignment updated.');
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiFetch(`/tasks/${taskId}`, token, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== taskId));
      triggerToast('Task deleted successfully.');
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  // DB Seeding Utility
  const handleSeedDatabase = async () => {
    try {
      const res = await apiFetch('/seed', null, { method: 'POST' });
      triggerToast(res.message);
      if (token) {
        loadData();
      } else {
        setAuthMode('login');
        setAuthForm({
          ...authForm,
          email: 'admin@taskmanager.com',
          password: 'admin123'
        });
      }
    } catch (error) {
      triggerToast(error.message, 'error');
    }
  };

  // Calculate statistics overview
  const getStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const overdue = tasks.filter(t => {
      if (t.status === 'Done') return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, todo, inProgress, completed, overdue, completionRate };
  };

  // Return Auth screen if token is absent
  if (!token) {
    return (
      <>
        <Toast toast={toast} />
        <AuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          setAuthForm={setAuthForm}
          handleAuthSubmit={handleAuthSubmit}
          handleSeedDatabase={handleSeedDatabase}
          loading={loading}
        />
      </>
    );
  }

  // Render workspace view layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Toast toast={toast} />
      
      <Navbar
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            tasks={tasks}
            projects={projects}
            stats={getStats()}
            setCurrentTab={setCurrentTab}
            setSelectedProjectId={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
            handleSeedDatabase={handleSeedDatabase}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            user={user}
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            showProjectModal={showProjectModal}
            setShowProjectModal={setShowProjectModal}
            projectForm={projectForm}
            setProjectForm={setProjectForm}
            handleCreateProject={handleCreateProject}
            handleDeleteProject={handleDeleteProject}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksKanbanView
            user={user}
            tasks={tasks}
            projects={projects}
            users={users}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            handleCreateTask={handleCreateTask}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
            handleUpdateTaskAssignee={handleUpdateTaskAssignee}
            handleDeleteTask={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}
