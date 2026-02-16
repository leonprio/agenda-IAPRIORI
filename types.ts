
export enum TaskStatus {
  INBOX = 'INBOX',
  PROGRESS = 'PROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string; // URL pública (Blob local o Firebase Storage URL)
  size: number;
  isUploading?: boolean; // Para feedback visual en tiempo real
}

export interface Link {
  id: string;
  url: string;
  title: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: UserRole;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string | null;
  createdAt: number;
  attachments?: Attachment[];
  links?: Link[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface AvailabilityBlock {
  userId: string;
  startTime: number; 
  endTime: number;
}
