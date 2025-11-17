'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [mongoUrl, setMongoUrl] = useState('mongodb://localhost:27017');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mongoUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please enter MongoDB URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoUrl, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Login successful',
        });
        onLoginSuccess();
      } else {
        toast({
          title: 'Authentication Failed',
          description: data.error || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMGVkNjQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg4djhoLTh6bS0yMCAwaDh2OGgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      <Card className="w-full max-w-md shadow-2xl border-emerald-200 dark:border-emerald-900 relative z-10 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50 dark:shadow-emerald-700/50 transform transition-transform hover:scale-105">
            <Database className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              MongoDB Access Manager
            </CardTitle>
            <CardDescription className="text-base mt-2 text-slate-600 dark:text-slate-400">
              Connect to your MongoDB instance
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mongoUrl" className="text-emerald-900 dark:text-emerald-100 font-medium">
                MongoDB URL
              </Label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Input
                  id="mongoUrl"
                  type="text"
                  placeholder="mongodb://localhost:27017"
                  value={mongoUrl}
                  onChange={(e) => setMongoUrl(e.target.value)}
                  className="pl-10 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-emerald-900 dark:text-emerald-100 font-medium">
                Username <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Leave empty if no auth required"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-500"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-900 dark:text-emerald-100 font-medium">
                Password <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Leave empty if no auth required"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-500"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-base shadow-lg shadow-emerald-500/50 dark:shadow-emerald-700/50 transition-all hover:shadow-xl hover:shadow-emerald-500/60 dark:hover:shadow-emerald-700/60"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect to MongoDB'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
