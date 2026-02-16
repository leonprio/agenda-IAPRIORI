
import React from 'react';
import { User, TaskStatus, Task, UserRole } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Alex', avatar: 'https://picsum.photos/seed/alex/40', color: 'bg-blue-500', role: UserRole.ADMIN, email: 'alex@syncro4.app' },
  { id: '2', name: 'Elena', avatar: 'https://picsum.photos/seed/elena/40', color: 'bg-purple-500', role: UserRole.EDITOR, email: 'elena@syncro4.app' },
  { id: '3', name: 'Marc', avatar: 'https://picsum.photos/seed/marc/40', color: 'bg-emerald-500', role: UserRole.EDITOR, email: 'marc@syncro4.app' },
  { id: '4', name: 'Sofia', avatar: 'https://picsum.photos/seed/sofia/40', color: 'bg-amber-500', role: UserRole.EDITOR, email: 'sofia@syncro4.app' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Prepare Q3 Report', status: TaskStatus.INBOX, assigneeId: '1', dueDate: '2023-12-01', createdAt: Date.now() },
  { id: 't2', title: 'Client Interview: Acme Corp', status: TaskStatus.PROGRESS, assigneeId: '2', dueDate: '2023-11-20', createdAt: Date.now() - 86400000 },
  { id: 't3', title: 'Technical Debt Review', status: TaskStatus.BLOCKED, assigneeId: '3', dueDate: null, createdAt: Date.now() - 172800000 },
];

export const STATUS_CONFIG = {
  [TaskStatus.INBOX]: { label: 'Entrada', color: 'text-gray-500', bg: 'bg-gray-100' },
  [TaskStatus.PROGRESS]: { label: 'En Proceso', color: 'text-blue-600', bg: 'bg-blue-50' },
  [TaskStatus.BLOCKED]: { label: 'Bloqueado', color: 'text-red-600', bg: 'bg-red-50' },
  [TaskStatus.DONE]: { label: 'Hecho', color: 'text-green-600', bg: 'bg-green-50' },
};
