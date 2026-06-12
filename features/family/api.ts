import { supabase } from '@/lib/supabase';
import type { Family, FamilyMember } from './types';
import type { Profile } from '@/features/auth/types';

export async function createFamilyWithDefaults(familyName: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_family_with_defaults', {
    family_name: familyName,
  });
  if (error) throw error;
  return data;
}

export async function joinFamilyByCode(code: string): Promise<string> {
  const { data, error } = await supabase.rpc('join_family_by_code', { code });
  if (error) throw error;
  return data;
}

export async function leaveFamily(familyId: string): Promise<void> {
  const { error } = await supabase.rpc('leave_family', { p_family_id: familyId });
  if (error) throw error;
}

export async function regenerateInviteCode(familyId: string): Promise<string> {
  const { data, error } = await supabase.rpc('regenerate_invite_code', {
    p_family_id: familyId,
  });
  if (error) throw error;
  return data;
}

export async function fetchFamily(familyId: string): Promise<Family> {
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('id', familyId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchFamilyMembers(
  familyId: string,
): Promise<(FamilyMember & { profile: Profile })[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*, profile:profiles(*)')
    .eq('family_id', familyId)
    .order('joined_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as (FamilyMember & { profile: Profile })[];
}
