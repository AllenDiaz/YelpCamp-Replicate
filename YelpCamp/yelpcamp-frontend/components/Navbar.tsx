'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/lib/store';

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      clearAuth();
      showToast('Logged out successfully', 'success');
      router.push('/');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
            YelpCamp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-gray-300 transition"
            >
              Home
            </Link>
            <Link
              href="/campgrounds"
              className="hover:text-gray-300 transition"
            >
              Campgrounds
            </Link>
            {isAuthenticated && (
              <Link
                href="/campgrounds/new"
                className="hover:text-gray-300 transition"
              >
                New
              </Link>
            )}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="hover:text-gray-300 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-300">Hello, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-800 rounded"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
