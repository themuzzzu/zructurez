
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface AuthProps {
  isSignup?: boolean;
}

const Auth: React.FC<AuthProps> = ({ isSignup = false }) => {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/profile" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        
        const success = await signUp(email, password);
        if (success) {
          navigate('/profile');
        }
      } else {
        const success = await signIn(email, password);
        if (success) {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">{isSignup ? 'Sign Up' : 'Sign In'}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {isSignup && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          
          <div className="text-center text-sm">
            {isSignup ? (
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
