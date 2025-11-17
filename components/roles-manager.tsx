'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RolePrivilegeBuilder } from './role-privilege-builder';
import { Switch } from '@/components/ui/switch';

interface MongoRole {
  _id: string;
  role: string;
  db: string;
  isBuiltin?: boolean;
  roles?: Array<{ role: string; db: string }>;
  privileges?: any[];
}

export function RolesManager() {
  const [roles, setRoles] = useState<MongoRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideBuiltinRoles, setHideBuiltinRoles] = useState(false);
  const { toast } = useToast();

  const [newRole, setNewRole] = useState({
    roleName: '',
    database: 'admin',
    inheritedRoles: [] as string[],
    privileges: [] as any[],
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/mongodb/roles');
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles || []);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch roles',
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

  const handleCreateRole = async () => {
    if (!newRole.roleName) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a role name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/mongodb/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleName: newRole.roleName,
          database: newRole.database,
          privileges: newRole.privileges,
          roles: newRole.inheritedRoles.map(role => {
            const [roleName, db] = role.split('@');
            return { role: roleName, db: db || newRole.database };
          }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Role created successfully',
        });
        setIsCreateDialogOpen(false);
        setNewRole({ roleName: '', database: 'admin', inheritedRoles: [], privileges: [] });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = async (roleName: string, database: string, isBuiltin: boolean) => {
    if (isBuiltin) {
      toast({
        title: 'Cannot Delete',
        description: 'Built-in roles cannot be deleted',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/mongodb/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName, database }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Role deleted successfully',
        });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive',
      });
    }
  };

  const toggleRoleSelection = (role: string) => {
    if (newRole.inheritedRoles.includes(role)) {
      setNewRole({
        ...newRole,
        inheritedRoles: newRole.inheritedRoles.filter(r => r !== role),
      });
    } else {
      setNewRole({
        ...newRole,
        inheritedRoles: [...newRole.inheritedRoles, role],
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const filteredRoles = hideBuiltinRoles ? roles.filter(role => !role.isBuiltin) : roles;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">MongoDB Roles</h2>
          <p className="text-muted-foreground">Manage database roles and permissions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hide-builtin"
              checked={hideBuiltinRoles}
              onCheckedChange={setHideBuiltinRoles}
            />
            <Label htmlFor="hide-builtin" className="text-sm cursor-pointer">
              Hide built-in roles
            </Label>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Add a new custom role with specific privileges and inherited roles</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.roleName}
                      onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database">Database</Label>
                    <Input
                      id="database"
                      value={newRole.database}
                      onChange={(e) => setNewRole({ ...newRole, database: e.target.value })}
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Privileges</Label>
                  <RolePrivilegeBuilder
                    privileges={newRole.privileges}
                    onChange={(privileges) => setNewRole({ ...newRole, privileges })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Inherited Roles (Optional)</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {roles.map((role) => {
                      const roleKey = `${role.role}@${role.db}`;
                      return (
                        <div key={roleKey} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`inherit-${roleKey}`}
                            checked={newRole.inheritedRoles.includes(roleKey)}
                            onChange={() => toggleRoleSelection(roleKey)}
                            className="rounded"
                          />
                          <Label htmlFor={`inherit-${roleKey}`} className="font-normal cursor-pointer flex items-center gap-2">
                            {role.role} ({role.db})
                            {role.isBuiltin && (
                              <Badge variant="outline" className="text-xs">
                                Built-in
                              </Badge>
                            )}
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
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRoles.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {hideBuiltinRoles ? 'No custom roles found' : 'No roles found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRoles.map((role) => (
            <Card key={`${role.role}@${role.db}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{role.role}</CardTitle>
                      {role.isBuiltin && (
                        <Badge variant="outline" className="text-xs">
                          Built-in
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Database: {role.db}</CardDescription>
                  </div>
                  {!role.isBuiltin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRole(role.role, role.db, role.isBuiltin || false)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {role.roles && role.roles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Inherited Roles:</Label>
                      <div className="flex flex-wrap gap-2">
                        {role.roles.map((inheritedRole, index) => (
                          <Badge key={index} variant="secondary">
                            {inheritedRole.role}
                            {inheritedRole.db !== role.db && ` (${inheritedRole.db})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {!role.isBuiltin && role.privileges && role.privileges.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Privileges ({role.privileges.length}):
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {role.privileges.map((priv: any, idx: number) => {
                          const resource = priv.resource?.collection
                            ? `${priv.resource.db}.${priv.resource.collection}`
                            : priv.resource?.db
                            ? priv.resource.db
                            : priv.resource?.cluster
                            ? 'Cluster'
                            : 'All';
                          const actions = priv.actions?.join(', ') || 'None';
                          return (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                            >
                              <span className="font-semibold">{resource}:</span> {actions}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {role.isBuiltin && (
                    <div className="text-sm text-muted-foreground italic">
                      Built-in role with system-defined privileges
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
