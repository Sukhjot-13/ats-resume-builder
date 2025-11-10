"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logger from '@/lib/logger';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    logger.info({ file: 'src/app/login/page.js', function: 'useEffect' }, 'Login page mounted');
    // This effect will run on mount and redirect if the middleware logic
    // determines the user is already logged in.
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    logger.info({ file: 'src/app/login/page.js', function: 'handleSendOtp', email }, 'Attempting to send OTP');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      logger.debug({ file: 'src/app/login/page.js', function: 'handleSendOtp', status: response.status }, 'OTP request response');

      if (response.ok) {
        logger.info({ file: 'src/app/login/page.js', function: 'handleSendOtp', email }, 'OTP sent successfully');
        setOtpSent(true);
      } else {
        const data = await response.json();
        logger.error({ file: 'src/app/login/page.js', function: 'handleSendOtp', email, error: data.error }, 'Failed to send OTP');
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      logger.error({ file: 'src/app/login/page.js', function: 'handleSendOtp', email, error: err }, 'An unexpected error occurred while sending OTP');
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    logger.info({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email }, 'Attempting to verify OTP');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      logger.debug({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', status: response.status }, 'Verify OTP request response');

      if (response.ok) {
        const { newUser } = await response.json();
        logger.info({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email, newUser }, 'OTP verified successfully');
        
        if (newUser) {
          logger.info({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email }, 'Redirecting new user to onboarding');
          router.push('/onboarding');
        } else {
          logger.info({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email }, 'Redirecting existing user to dashboard');
          router.push('/dashboard');
        }
      } else {
        const data = await response.json();
        logger.error({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email, error: data.error }, 'Failed to verify OTP');
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (err) {
      logger.error({ file: 'src/app/login/page.js', function: 'handleVerifyOtp', email, error: err }, 'An unexpected error occurred while verifying OTP');
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-bg-primary">
      <Card className="w-full max-w-md bg-surface">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-accent">Login</CardTitle>
          <CardDescription className="text-text-muted">
            Enter your email to receive a one-time password.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-brand-primary hover:bg-accent/90" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-brand-primary hover:bg-accent/90" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-text-muted text-center w-full">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}