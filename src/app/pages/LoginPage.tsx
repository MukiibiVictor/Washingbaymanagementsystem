import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Car } from 'lucide-react';
import { toast } from 'sonner';
import zeroLogo from '../../assets/7c8b52700404010ef9d70a93ba8a793d0656723b.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Multiple Background Logos - Fading Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <div 
          className="absolute top-10 left-10 w-48 h-48 opacity-[0.015] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '4s',
          }}
        />
        {/* Top Right */}
        <div 
          className="absolute top-20 right-20 w-64 h-64 opacity-[0.02] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '5s',
            animationDelay: '1s',
          }}
        />
        {/* Center Large */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.01] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '6s',
            animationDelay: '2s',
          }}
        />
        {/* Bottom Left */}
        <div 
          className="absolute bottom-20 left-32 w-56 h-56 opacity-[0.015] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '5.5s',
            animationDelay: '0.5s',
          }}
        />
        {/* Bottom Right */}
        <div 
          className="absolute bottom-10 right-10 w-40 h-40 opacity-[0.02] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '4.5s',
            animationDelay: '1.5s',
          }}
        />
        {/* Middle Right */}
        <div 
          className="absolute top-1/3 right-10 w-52 h-52 opacity-[0.012] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '5s',
            animationDelay: '2.5s',
          }}
        />
        {/* Middle Left */}
        <div 
          className="absolute top-2/3 left-20 w-44 h-44 opacity-[0.018] animate-pulse"
          style={{
            backgroundImage: `url(${zeroLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(0) invert(1)',
            animationDuration: '4.8s',
            animationDelay: '0.8s',
          }}
        />
      </div>
      
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}