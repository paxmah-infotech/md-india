"use client";

import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex text-black items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <RegisterForm />
    </div>
  );
}