'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { User, Save, Loader2, Sun, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fallback URL in case process.env is missing during the viva
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// 1. Updated useEffect to avoid the "cascading render" warning
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      username: 'Prayas Shrestha',
      email: 'prayas@example.com',
    }
  });

  const onUpdateProfile = async (data: { username: string }) => {
    const toastId = toast.loading('Updating profile...');
    try {
      const response = await fetch(`${API_BASE}/api/auth/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ newUsername: data.username }),
      });

      if (response.ok) {
        toast.success('Username updated!', { id: toastId });
        setTimeout(() => window.location.reload(), 1000); // Force sync
      } else {
        const err = await response.json();
        toast.error(err.message || 'Update failed', { id: toastId });
      }
    } catch {
      toast.error('Server connection failed', { id: toastId });
    }
  };

  const onDeleteAccount = async () => {
    if (!window.confirm("CRITICAL: This will wipe all progress. Delete permanently?")) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting account...');

    try {
      const response = await fetch(`${API_BASE}/api/auth/delete-account`, {
        method: 'DELETE',
        credentials: 'include', // This sends your auth cookie to the backend
      });

      if (response.ok) {
        toast.success('Account wiped. Redirecting...', { id: toastId });
        
        // Clear local storage to ensure no ghost data remains
        localStorage.clear();
        sessionStorage.clear();

        // Use hard redirect to clear React state completely
        setTimeout(() => {
          window.location.href = '/signup'; 
        }, 1500);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Delete failed', { id: toastId });
        setIsDeleting(false);
      }
    } catch {
      toast.error('Network error - check if server is running', { id: toastId });
      setIsDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground italic">Manage your profile and appearance</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" /> Profile Details
        </h2>
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Display Name</label>
              <input 
                {...register('username', { required: true })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Email</label>
              <input disabled {...register('email')} className="w-full bg-muted border border-border rounded-xl px-4 py-3 opacity-50 cursor-not-allowed" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
            </button>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" /> Theme Preference
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((t) => (
            <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 capitalize font-bold transition-all ${theme === t ? 'border-indigo-500 bg-indigo-500/10' : 'border-border opacity-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-8 flex items-center justify-between">
        <div>
          <h3 className="text-red-400 font-bold text-lg flex items-center gap-2">
            <AlertTriangle size={20} /> Danger Zone
          </h3>
          <p className="text-sm opacity-60">Once you delete your account, there is no going back.</p>
        </div>
        <button 
          onClick={onDeleteAccount} 
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="animate-spin" /> : "Delete Account"}
        </button>
      </div>
    </div>
  );
}