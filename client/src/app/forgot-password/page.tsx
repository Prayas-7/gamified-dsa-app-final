'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, KeyRound, Lock } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../../lib/axios';

// Define strict interfaces for form inputs
interface EmailFormData {
  email: string;
}

interface ResetFormData {
  otp: string;
  newPassword: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Separate hook instances for better typing
  const emailForm = useForm<EmailFormData>();
  const resetForm = useForm<ResetFormData>();

  const onEmailSubmit: SubmitHandler<EmailFormData> = async (data) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setStep('OTP');
      toast.success("OTP sent to your email!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    }
  };

  const onResetSubmit: SubmitHandler<ResetFormData> = async (data) => {
    try {
      await api.post('/auth/reset-password', { 
        email, 
        otp: data.otp, 
        newPassword: data.newPassword 
      });
      toast.success("Password reset successfully!");
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Invalid OTP or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-foreground text-center">
          {step === 'EMAIL' ? 'Reset Password' : 'Verify Code'}
        </h1>
        
        <AnimatePresence mode="wait">
          {step === 'EMAIL' ? (
            <motion.form key="email" onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="mt-6 space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input {...emailForm.register('email', { required: true })} type="email" placeholder="Enter your email" className="w-full bg-background border border-border rounded-xl pl-10 py-2.5 outline-none focus:border-indigo-500" />
              </div>
              <button disabled={emailForm.formState.isSubmitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                {emailForm.formState.isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Send OTP'}
              </button>
            </motion.form>
          ) : (
            <motion.form key="otp" onSubmit={resetForm.handleSubmit(onResetSubmit)} className="mt-6 space-y-4">
              <div className="relative group">
                <KeyRound className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input {...resetForm.register('otp', { required: true })} placeholder="Enter 6-digit OTP" className="w-full bg-background border border-border rounded-xl pl-10 py-2.5 outline-none focus:border-indigo-500" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input {...resetForm.register('newPassword', { required: true })} type="password" placeholder="New Password" className="w-full bg-background border border-border rounded-xl pl-10 py-2.5 outline-none focus:border-indigo-500" />
              </div>
              <button disabled={resetForm.formState.isSubmitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                {resetForm.formState.isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Reset Password'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}