import { supabase } from '@/lib/supabase';
import type { CompleteTaskResult, CreateTaskInput, Task } from './types';

export async function fetchTasks(familyId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTask(input: CreateTaskInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_task', {
    p_family_id: input.familyId,
    p_title: input.title,
    p_description: input.description ?? null,
    p_assigned_to: input.assignedTo ?? null,
    p_due_date: input.dueDate ?? null,
    p_due_time: input.dueTime ?? null,
    p_repeat_type: input.repeatType ?? 'none',
  });
  if (error) throw error;
  return data;
}

export async function completeTask(taskId: string): Promise<CompleteTaskResult> {
  const { data, error } = await supabase.rpc('complete_task', { p_task_id: taskId });
  if (error) throw error;
  return data;
}

export async function uncompleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.rpc('uncomplete_task', { p_task_id: taskId });
  if (error) throw error;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}
