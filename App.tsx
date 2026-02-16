
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Task, TaskStatus, User, UserRole } from './types';
import { MOCK_TASKS, USERS, STATUS_CONFIG } from './constants';
import { QuickCapture } from './components/QuickCapture';
import { TaskCard } from './components/TaskCard';
import { CollectiveAvailability } from './components/CollectiveAvailability';
import { AdminPanel } from './components/AdminPanel';
import { LoginView } from './components/LoginView';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('s4_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('s4_users');
    return saved ? JSON.parse(saved) : USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('s4_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('s4_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('s4_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('s4_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('s4_current_user');
    }
  }, [currentUser]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: userData.name || 'Nuevo Usuario',
      email: userData.email,
      avatar: `https://picsum.photos/seed/${userData.name}/80`,
      color: 'bg-blue-500',
      role: userData.role || UserRole.EDITOR
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleRemoveUser = (id: string) => {
    if (users.length <= 1) return alert("Debe haber al menos un administrador.");
    if (currentUser?.id === id) return alert("No puedes eliminarte a ti mismo.");
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      const updatedSelf = updated.find(u => u.id === currentUser?.id);
      if (updatedSelf) setCurrentUser(updatedSelf);
      return updated;
    });
  };

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) {
    return <LoginView users={users} onLogin={setCurrentUser} />;
  }

  const FocusView = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Hola, {currentUser.name}</h1>
        <p className="text-gray-400 font-medium">Tienes {tasks.filter(t => t.status !== TaskStatus.DONE).length} tareas activas.</p>
      </div>
      <QuickCapture onTaskCreated={(newTask) => setTasks(prev => [newTask, ...prev])} users={users} />
      <div className="space-y-4">
        {tasks.filter(t => t.status !== TaskStatus.DONE).slice(0, 10).map(task => (
          <TaskCard key={task.id} task={task} users={users} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
        ))}
      </div>
    </div>
  );

  const TeamBoard = () => (
    <div className="h-[calc(100vh-64px)] p-8 overflow-hidden">
      <div className="flex h-full space-x-6 overflow-x-auto pb-4 custom-scrollbar">
        {Object.values(TaskStatus).map(status => (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{STATUS_CONFIG[status].label}</h2>
              <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-black">{tasks.filter(t => t.status === status).length}</span>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 px-1 custom-scrollbar">
              {tasks.filter(t => t.status === status).map(task => (
                <TaskCard key={task.id} task={task} users={users} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CalendarView = () => (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Agenda Colectiva</h1>
        <p className="text-gray-400 font-medium">Disponibilidad sincronizada de los 4 integrantes del equipo.</p>
      </div>
      <CollectiveAvailability users={users} />
    </div>
  );

  const AdminView = () => {
    if (currentUser.role !== UserRole.ADMIN) return <Navigate to="/" replace />;
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Administración</h1>
          <p className="text-gray-400 font-medium">Gestión de cuentas de editores y permisos del sistema.</p>
        </div>
        <AdminPanel users={users} onAddUser={handleAddUser} onRemoveUser={handleRemoveUser} onUpdateUser={handleUpdateUser} />
      </div>
    );
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#F4F5F7]">
        <nav className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-12">
            <span className="text-xl font-black tracking-tighter text-blue-600">S4.</span>
            <div className="flex space-x-8">
              <NavLink to="/" className={({isActive}) => `text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>Focus</NavLink>
              <NavLink to="/team" className={({isActive}) => `text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>Tablero</NavLink>
              <NavLink to="/agenda" className={({isActive}) => `text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>Agenda</NavLink>
              {currentUser.role === UserRole.ADMIN && (
                <NavLink to="/admin" className={({isActive}) => `text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>Admin</NavLink>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 pr-6 border-r border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-none">{currentUser.name}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{currentUser.role}</p>
              </div>
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" alt={currentUser.name} />
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-all flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Salir</span>
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<FocusView />} />
            <Route path="/team" element={<TeamBoard />} />
            <Route path="/agenda" element={<CalendarView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
