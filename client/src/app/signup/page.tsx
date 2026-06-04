'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupFormData>();
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      // The server will set the HttpOnly cookie, so no need for manual localStorage set
      await api.post('/auth/signup', data);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Signup failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;
      await api.post('/auth/google', { token: credentialResponse.credential });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Google registration failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
        >
          <h1 className="text-3xl font-extrabold text-center tracking-tight text-foreground">Create Account</h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">Start learning DSA the fun way</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('username', { required: 'Name is required', minLength: { value: 3, message: 'Min 3 chars' } })}
                  type="text"
                  className="w-full bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="AlgoMaster99"
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  type="password"
                  className="w-full bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
              <div className="relative group">
                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || "Passwords do not match"
                  })}
                  type="password"
                  className="w-full bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder-muted-foreground"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-card text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google Registration Failed')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="350"
              text="continue_with"
            />
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-500 font-bold hover:underline">Log In</Link>
          </p>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}