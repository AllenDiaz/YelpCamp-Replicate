'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/lib/api';
import { useAuthStore, useToastStore } from '@/lib/store';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      const { token, user } = response.data;
      
      setAuth(user, token);
      showToast('Logged in successfully!', 'success');
      router.push('/campgrounds');
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Login failed. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-lg overflow-hidden">
          {/* Header Image */}
          <img
            src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
            alt="Campsite"
            className="w-full h-48 object-cover"
          />
          
          {/* Form */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6">Login</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoFocus
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.username ? 'border-error' : 'border-border'
                  }`}
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-error">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.password ? 'border-error' : 'border-border'
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-secondary-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-4 text-center text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
