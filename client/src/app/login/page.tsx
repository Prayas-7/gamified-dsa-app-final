'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useUserStore } from '../../store/useStore';

interface LoginFormData {
  email: string;
  password: string;
}

interface AuthResponse {
  username: string;
  xp: number;
  completedLevels: string[];
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  
  // Explicitly type the selector to avoid 'any'
  const setUser = useUserStore((state) => (state as { setUser: (user: AuthResponse) => void }).setUser);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser({
      username: data.username,
      xp: data.xp,
      completedLevels: data.completedLevels || []
    });
    toast.success(`Welcome back, ${data.username}!`);
    router.push('/dashboard');
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/auth/login', data);
      handleAuthSuccess(res.data);
    } catch (error: unknown) {
      // Safely check for AxiosError without using 'any'
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      handleAuthSuccess(res.data);
    } catch {
      toast.error('Google authentication failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
        >
          <h1 className="text-3xl font-extrabold text-center tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">Continue your path to mastery</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full bg-background border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="w-full bg-background border border-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-card text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google Login Failed')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="350"
              text="continue_with"
            />
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-500 font-bold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}