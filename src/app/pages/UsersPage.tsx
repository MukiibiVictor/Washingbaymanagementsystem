import { useEffect, useState } from 'react';
import { User, UserRole } from '../lib/types';
import { usersApi } from '../lib/api-service';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { formatDate } from '../lib/utils';
import { Users, Shield, Eye, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ROLE_INFO = {
  superadmin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-800',
    icon: Shield,
    description: 'Full system access including user management and pricing',
  },
  admin: {
    label: 'Admin',
    color: 'bg-blue-100 text-blue-800',
    icon: Users,
    description: 'Can confirm check-ins, manage transactions, and process payments',
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-gray-100 text-gray-800',
    icon: Eye,
    description: 'Read-only access to dashboard and reports',
  },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();

  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('viewer');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await usersApi.getAll();
    setUsers(data);
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await usersApi.create({
      email: newUserEmail,
      name: newUserName,
      role: newUserRole,
      password: newUserPassword,
    });

    if (result.success) {
      toast.success(`User ${newUserName} created successfully!`);
      setCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('viewer');
      setNewUserPassword('');
      loadUsers();
    } else {
      toast.error(result.error || 'Failed to create user');
    }

    setSubmitting(false);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);

    const result = await usersApi.update(selectedUser.id, {
      name: editUserName,
      role: editUserRole,
    });

    if (result.success) {
      toast.success('User updated successfully!');
      setEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } else {
      toast.error(result.error || 'Failed to update user');
    }

    setSubmitting(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);

    const result = await usersApi.delete(selectedUser.id);

    if (result.success) {
      toast.success('User deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } else {
      toast.error(result.error || 'Failed to delete user');
    }

    setSubmitting(false);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUserName(user.name);
    setEditUserRole(user.role);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const canManageUsers = currentUser?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-600 mt-2">Manage system users and their roles</p>
        </div>

        {canManageUsers && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateUser}>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system and assign their role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUserRole}
                      onValueChange={(value) => setNewUserRole(value as UserRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="superadmin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Super Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      {ROLE_INFO[newUserRole].description}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!canManageUsers && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-800">
              You have read-only access. Only SuperAdmin users can create and manage user accounts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Role Information */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(ROLE_INFO).map(([role, info]) => {
          const Icon = info.icon;
          return (
            <Card key={role} className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{info.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{info.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users List */}
      <Card className="hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const roleInfo = ROLE_INFO[user.role];
                const RoleIcon = roleInfo.icon;
                const isCurrentUser = user.id === currentUser?.id;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all ${
                      isCurrentUser ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${roleInfo.color} flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all`}>
                      <RoleIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{user.name}</p>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Joined: {formatDate(user.created_at)}</span>
                        {user.last_login && <span>Last login: {formatDate(user.last_login)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                      {canManageUsers && !isCurrentUser && (
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditUser}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and role assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editUserRole}
                  onValueChange={(value) => setEditUserRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>Viewer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="superadmin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Super Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  {ROLE_INFO[editUserRole].description}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for{' '}
              <strong>{selectedUser?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-blue-900">Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription className="text-blue-700 mt-2">
                The system implements role-based permissions to ensure proper access control:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>SuperAdmin</strong> can access all features including user management and pricing
                    rules
                  </li>
                  <li>
                    <strong>Admin</strong> can confirm check-ins, manage transactions, and process payments
                  </li>
                  <li>
                    <strong>Viewer</strong> can only view dashboards and reports without making changes
                  </li>
                </ul>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
