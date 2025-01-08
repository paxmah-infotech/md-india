'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';

// Form validation schema
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function RequestResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          type: 'request'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        reset();
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to send reset email. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login Link */}
        <Link
          href="/auth/signin"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="text"
                    id="email"
                    autoComplete="email"
                    className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                      errors.email || error ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-500 text-xl mb-4">✓</div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="text-gray-600">
                Password reset instructions have been sent to your email address.
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setError(null);
                  reset();
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Try another email
              </button>
            </div>
          )}
        </motion.div>

        {/* Additional Links */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
