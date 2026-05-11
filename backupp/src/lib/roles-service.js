import { supabase } from './customSupabaseClient';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  EDITOR: 'editor',
  TECHNICIAN: 'technician',
  // New Roles Added
  CONSULTANT: 'consultant',
  NEWS_MANAGER: 'news_manager',
  SUPPORT_MANAGER: 'support_manager'
};

// Arabic Labels for Roles
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'مسؤول النظام',
  [ROLES.MANAGER]: 'مدير عام',
  [ROLES.SUPERVISOR]: 'مشرف عام',
  [ROLES.EDITOR]: 'محرر صحفي',
  [ROLES.TECHNICIAN]: 'تقني بث',
  [ROLES.CONSULTANT]: 'مستشار',
  [ROLES.NEWS_MANAGER]: 'مدير الأخبار',
  [ROLES.SUPPORT_MANAGER]: 'مدير الدعم الفني'
};

export const fetchSiteStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_public_stats');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};