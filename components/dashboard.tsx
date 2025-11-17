'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Shield, Database } from 'lucide-react';
import { UsersManager } from './users-manager';
import { RolesManager } from './roles-manager';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('users');
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
      onLogout();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMGVkNjQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0NGg4djhoLTh6bS0yMCAwaDh2OGgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      <header className="border-b border-emerald-200 dark:border-emerald-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-emerald-500/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 dark:shadow-emerald-700/50">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                MongoDB Access Manager
              </h1>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Database Management Panel</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-800 dark:hover:text-emerald-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/10 p-1">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-md"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-md"
            >
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="roles">
            <RolesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
