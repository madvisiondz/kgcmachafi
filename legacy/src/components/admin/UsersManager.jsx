import React, { useEffect, useMemo, useState } from 'react';
import { Search, Users, Shield, UserCog, RefreshCw } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';

const ROLE_OPTIONS = [
  { value: 'member', label: 'مستخدم' },
  { value: 'editor', label: 'Editor' },
  { value: 'moderator', label: 'Moderator' },
];

const fieldClass =
  'bg-[#0b1020]/40 border-white/10 text-slate-100 placeholder:text-slate-500';

export default function UsersManager({ adminRole }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);

  const canAssignRoles = adminRole === 'admin';

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => {
      const hay = `${u.email || ''} ${u.full_name || ''} ${u.phone || ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listPublicUsers({ limit: 300 });
      setUsers(res.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (userId, role) => {
    if (!canAssignRoles) {
      toast({
        title: 'غير مصرح',
        description: 'المشرف (Moderator) يمكنه التحكم بالمحتوى فقط بدون تغيير أدوار المستخدمين.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingId(userId);
    try {
      const res = await adminApi.updatePublicUserRole(userId, role);
      setUsers((current) => current.map((u) => (u.id === userId ? (res.user || u) : u)));
      toast({ title: 'تم', description: 'تم تحديث الدور بنجاح.' });
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">إدارة المستخدمين</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl sm:w-[360px]">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالبريد، الاسم، الهاتف..."
              className="border-0 bg-transparent p-0 text-slate-100 shadow-none placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[980px] text-slate-100">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-right text-slate-300">البريد الإلكتروني</TableHead>
                <TableHead className="text-right text-slate-300">الاسم</TableHead>
                <TableHead className="text-right text-slate-300">الهاتف</TableHead>
                <TableHead className="text-right text-slate-300">الحالة</TableHead>
                <TableHead className="text-right text-slate-300">الدور</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-slate-400">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-slate-400">
                    لا يوجد مستخدمون مطابقون.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-slate-100">{u.email}</TableCell>
                    <TableCell className="text-slate-200">{u.full_name || '-'}</TableCell>
                    <TableCell className="text-slate-200" dir="ltr">
                      {u.phone || '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          u.is_active
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : 'bg-rose-500/20 text-rose-200'
                        }`}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        {u.is_active ? 'نشط' : 'موقوف'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <UserCog className="h-4 w-4 text-slate-400" />
                        <Select
                          value={u.role || 'member'}
                          onValueChange={(value) => updateRole(u.id, value)}
                          disabled={!canAssignRoles || submittingId === u.id}
                        >
                          <SelectTrigger
                            className={`w-[200px] ${fieldClass}`}
                          >
                            <SelectValue placeholder="اختر الدور" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-[#0f1629] text-slate-100">
                            {ROLE_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="focus:bg-white/10 focus:text-slate-100"
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!canAssignRoles && (
                          <span className="text-xs text-slate-400">صلاحياتك لا تسمح بتغيير الأدوار</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
        <div className="mb-2 font-semibold text-slate-100">قواعد الصلاحيات</div>
        <ul className="list-disc space-y-1 pr-5 leading-relaxed">
          <li>
            <span className="font-semibold text-slate-200">Editor</span>
            {' — صلاحية تعديل «نقطة دخول واحدة» (مربوطة بصفحة الأخبار).'}
          </li>
          <li>
            <span className="font-semibold text-slate-200">Moderator</span>
            {' — تحكم بجميع أقسام لوحة الإدارة، بدون تعديل أدوار المستخدمين.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
