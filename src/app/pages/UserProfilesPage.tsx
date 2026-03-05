import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { usersApi } from '../lib/mock-api';
import { User } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Shield, Users as UsersIcon, Phone, CreditCard, Mail, Calendar, Search } from 'lucide-react';

export default function UserProfilesPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await usersApi.getAll();
    setUsers(data);
    setLoading(false);
  };

  // Only superadmins can access this page
  if (currentUser?.role !== 'superadmin') {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
              <p className="text-red-700">
                Only SuperAdmin users can view all user profiles.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            User Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View detailed information about all system users
          </p>
        </div>
        <Badge className="bg-purple-600 text-white">
          <UsersIcon className="w-4 h-4 mr-1" />
          {users.length} Users
        </Badge>
      </div>

      {/* Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const initials = user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <Card
                key={user.id}
                className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getRoleColor(user.role)} variant="secondary">
                      {user.role}
                    </Badge>
                    {user.id === currentUser.id && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="w-24 h-24 border-4 border-slate-200">
                      <AvatarImage src={user.profile_picture} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {user.contact && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Contact</p>
                          <p className="text-sm font-medium text-slate-900">
                            {user.contact}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.id_number && (
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">ID Number</p>
                          <p className="text-sm font-medium text-slate-900">
                            {user.id_number}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Member Since</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {user.last_login && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Last Login</p>
                          <p className="text-sm font-medium text-slate-900">
                            {new Date(user.last_login).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Missing Information Notice */}
                  {(!user.contact || !user.id_number) && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                        {!user.contact && !user.id_number
                          ? 'Contact and ID not provided'
                          : !user.contact
                          ? 'Contact not provided'
                          : 'ID not provided'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No users found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search query
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
