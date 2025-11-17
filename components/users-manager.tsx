'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, UserPlus, Shield, Key, Copy, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MongoUser {
  _id: string;
  user: string;
  db: string;
  roles: Array<{ role: string; db: string }>;
}

interface MongoRole {
  _id: string;
  role: string;
  db: string;
  isBuiltin?: boolean;
}

export function UsersManager() {
  const [users, setUsers] = useState<MongoUser[]>([]);
  const [roles, setRoles] = useState<MongoRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGrantRolesDialogOpen, setIsGrantRolesDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MongoUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    database: 'admin',
    selectedRoles: [] as string[],
  });

  const [grantRolesForm, setGrantRolesForm] = useState({
    database: 'admin',
    selectedRoles: [] as string[],
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/mongodb/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch users',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to MongoDB',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/mongodb/roles');
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password || newUser.selectedRoles.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields and select at least one role',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/mongodb/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          database: newUser.database,
          roles: newUser.selectedRoles.map(role => {
            const [roleName, db] = role.split('@');
            return { role: roleName, db: db || newUser.database };
          }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        setIsCreateDialogOpen(false);
        setNewUser({ username: '', password: '', database: 'admin', selectedRoles: [] });
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (username: string, database: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/mongodb/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, database }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleGrantRoles = async () => {
    if (!selectedUser || grantRolesForm.selectedRoles.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one role',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/mongodb/grant-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: selectedUser.user,
          database: grantRolesForm.database,
          roles: grantRolesForm.selectedRoles.map(role => {
            const [roleName, db] = role.split('@');
            return { role: roleName, db: db || grantRolesForm.database };
          }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Roles granted successfully',
        });
        setIsGrantRolesDialogOpen(false);
        setGrantRolesForm({ database: 'admin', selectedRoles: [] });
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to grant roles',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to grant roles',
        variant: 'destructive',
      });
    }
  };

  const generateSecurePassword = () => {
    const length = 16;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setNewUser({ ...newUser, password });
    toast({
      title: 'Password Generated',
      description: 'A secure password has been generated',
    });
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(newUser.password);
    toast({
      title: 'Copied',
      description: 'Password copied to clipboard',
    });
  };

  const toggleRoleSelection = (role: string, selectedRoles: string[], setFunction: Function) => {
    if (selectedRoles.includes(role)) {
      setFunction((prev: any) => ({
        ...prev,
        selectedRoles: prev.selectedRoles.filter((r: string) => r !== role),
      }));
    } else {
      setFunction((prev: any) => ({
        ...prev,
        selectedRoles: [...prev.selectedRoles, role],
      }));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">MongoDB Users</h2>
          <p className="text-muted-foreground">Manage database users and their roles</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new MongoDB user with specific roles</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateSecurePassword}
                    title="Generate secure password"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  {newUser.password && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyPasswordToClipboard}
                      title="Copy password"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="database">Database</Label>
                <Input
                  id="database"
                  value={newUser.database}
                  onChange={(e) => setNewUser({ ...newUser, database: e.target.value })}
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {roles.map((role) => {
                    const roleKey = `${role.role}@${role.db}`;
                    return (
                      <div key={roleKey} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`role-${roleKey}`}
                          checked={newUser.selectedRoles.includes(roleKey)}
                          onChange={() => toggleRoleSelection(roleKey, newUser.selectedRoles, setNewUser)}
                          className="rounded"
                        />
                        <Label htmlFor={`role-${roleKey}`} className="font-normal cursor-pointer">
                          {role.role} ({role.db})
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={`${user.user}@${user.db}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{user.user}</CardTitle>
                    <CardDescription>Database: {user.db}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setGrantRolesForm({ database: user.db, selectedRoles: [] });
                        setIsGrantRolesDialogOpen(true);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.user, user.db)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Roles:</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role, index) => (
                        <Badge key={index} variant="secondary">
                          {role.role}
                          {role.db !== user.db && ` (${role.db})`}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isGrantRolesDialogOpen} onOpenChange={setIsGrantRolesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Grant Roles</DialogTitle>
            <DialogDescription>
              Add roles to user: {selectedUser?.user}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="grant-database">Database</Label>
              <Input
                id="grant-database"
                value={grantRolesForm.database}
                onChange={(e) => setGrantRolesForm({ ...grantRolesForm, database: e.target.value })}
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Roles</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {roles.map((role) => {
                  const roleKey = `${role.role}@${role.db}`;
                  return (
                    <div key={roleKey} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`grant-role-${roleKey}`}
                        checked={grantRolesForm.selectedRoles.includes(roleKey)}
                        onChange={() => toggleRoleSelection(roleKey, grantRolesForm.selectedRoles, setGrantRolesForm)}
                        className="rounded"
                      />
                      <Label htmlFor={`grant-role-${roleKey}`} className="font-normal cursor-pointer">
                        {role.role} ({role.db})
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGrantRolesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantRoles}>Grant Roles</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
