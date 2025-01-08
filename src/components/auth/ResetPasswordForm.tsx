'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';

// Password validation schema
const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset token');
      router.push('/auth/signin');
    }
  }, [token, router]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
          type: 'reset'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setResetSuccess(true);
        reset();
        toast.success(result.message);
        // Redirect to signin after 2 seconds
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <>
      {!resetSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePassword('password')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePassword('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="rounded-md bg-gray-50 p-4">
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-2">Password must contain:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-green-500 text-xl mb-4">✓</div>
          <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
          <p className="text-gray-600">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
      )}
    </>
  );
}
