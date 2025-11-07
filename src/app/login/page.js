
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  console.log('LoginPage component rendered');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect in LoginPage triggered');
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const accessToken = getCookie('accessToken');
    console.log('accessToken from cookie in useEffect:', accessToken);
    if (accessToken) {
      console.log('Redirecting to dashboard from useEffect...');
      router.push('/dashboard');
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    console.log('handleSendOtp called');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('OTP sent successfully');
        setOtpSent(true);
      } else {
        const data = await response.json();
        console.error('Failed to send OTP:', data.error);
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('An unexpected error occurred while sending OTP:', err);
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log('handleVerifyOtp called');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const { accessToken, refreshToken, newUser } = await response.json();
        console.log('OTP verified successfully');
        // Store tokens in cookies
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${15 * 60}`; // 15 minutes
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${15 * 24 * 60 * 60}`; // 15 days

        if (newUser) {
          console.log('New user, redirecting to onboarding...');
          router.push('/onboarding');
        } else {
          console.log('Existing user, redirecting to dashboard...');
          router.push('/dashboard');
        }
      } else {
        const data = await response.json();
        console.error('Failed to verify OTP:', data.error);
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('An unexpected error occurred while verifying OTP:', err);
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label htmlFor="otp" className="block mb-2">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
