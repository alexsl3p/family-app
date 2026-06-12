export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  created_by: string;
  due_date: string | null;
  due_time: string | null;
  repeat_type: RepeatType;
  is_completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  familyId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  dueTime?: string;
  repeatType?: RepeatType;
}

export interface CompleteTaskResult {
  status: 'completed' | 'rolled_forward' | 'already_completed';
  rolled_forward: boolean;
  new_due_date?: string;
}
