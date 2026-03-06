import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Car } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '../lib/api-service';
import zeroLogo from '../../assets/7c8b52700404010ef9d70a93ba8a793d0656723b.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid email or password');
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setRegistering(true);

    const result = await usersApi.create({
      email: regEmail,
      name: regName,
      role: 'viewer',
      password: regPassword,
    });

    if (result.success) {
      toast.success('Account created! Please sign in.');
      // Auto-login after registration
      const loginSuccess = await login(regEmail, regPassword);
      if (loginSuccess) {
        navigate('/services');
      }
    } else {
      toast.error(result.error || 'Failed to create account');
    }

    setRegistering(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-900/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative hover:scale-110 transition-all">
              <img src={zeroLogo} alt="Zero Logo" className="w-24 h-24 object-contain" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white">ZORI auto spa</CardTitle>
          <CardDescription className="text-slate-400">flawless shine, water with luxury</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600">Login</TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-blue-600">User Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Admin Login Tab */}
            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@zoriautospa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-xs text-slate-400 text-center mt-2">
                  Admin accounts are created by superadmin only
                </p>
              </form>
            </TabsContent>

            {/* User Registration Tab */}
            <TabsContent value="user">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="regName" className="text-slate-200">Full Name</Label>
                  <Input
                    id="regName"
                    type="text"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regEmail" className="text-slate-200">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword" className="text-slate-200">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regConfirmPassword" className="text-slate-200">Confirm Password</Label>
                  <Input
                    id="regConfirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={registering}>
                  {registering ? 'Creating Account...' : 'Create User Account'}
                </Button>
                <p className="text-xs text-slate-400 text-center mt-2">
                  User accounts can view services and pricing only
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}