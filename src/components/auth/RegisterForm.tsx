"use client";

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setSuccess('Registration successful! Verify your account and sign in now.');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setSuccess('');
        router.push('/auth/signin');
      }, 3000);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-2xl font-semibold text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded">{error}</div>}
        {success && <div className="p-2 text-green-700 bg-green-100 border border-green-300 rounded">{success}</div>}

        <div>
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            variant="bordered"
            required
            onChange={(e) => setEmail(e.target.value)}
            className=" focus:border-blue-500"
          />
        </div>

        <div>
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              variant="bordered"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none">
          Register
        </button>
      </form>

      <div className="my-6 border-t border-gray-300"></div>
      <p className="mt-4 text-center">
        Already have an account? 
        <button onClick={() => window.location.href = '/auth/signin'} className="ml-2 text-blue-600 hover:underline">
          Sign In
        </button>
      </p>
    </div>
  );
}
