import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { usersApi } from '../lib/mock-api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { User, Camera, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setContact(currentUser.contact || '');
      setIdNumber(currentUser.id_number || '');
      setProfilePicture(currentUser.profile_picture || '');
      setPreviewImage(currentUser.profile_picture || '');
    }
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setProfilePicture(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    setLoading(true);

    const result = await usersApi.updateProfile(currentUser.id, {
      name,
      contact,
      id_number: idNumber,
      profile_picture: profilePicture,
    });

    if (result.success) {
      toast.success('Profile updated successfully');
      // Update the auth context with new user data
      if (result.user) {
        localStorage.setItem('zori_user', JSON.stringify(result.user));
        window.location.reload();
      }
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setLoading(false);
  };

  if (!currentUser) return null;

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-slate-200">
                <AvatarImage src={previewImage} alt={currentUser.name} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h3>
                <p className="text-sm text-slate-500">{currentUser.email}</p>
              </div>

              <Badge className="bg-blue-600 text-white capitalize">
                {currentUser.role}
              </Badge>

              <div className="w-full pt-4 border-t border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Member since:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(currentUser.created_at).toLocaleDateString()}
                  </span>
                </div>
                {currentUser.last_login && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last login:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(currentUser.last_login).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Edit Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label htmlFor="profile-picture" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Profile Picture
                </Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-2 border-slate-200">
                    <AvatarImage src={previewImage} alt="Preview" />
                    <AvatarFallback className="bg-slate-100 text-slate-600">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Upload a profile picture (JPG, PNG, max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +256 700 123 456"
                />
                <p className="text-xs text-slate-500">
                  Optional: Your phone number for contact purposes
                </p>
              </div>

              {/* ID Number */}
              <div className="space-y-2">
                <Label htmlFor="id-number">ID Number</Label>
                <Input
                  id="id-number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. National ID, Passport Number"
                />
                <p className="text-xs text-slate-500">
                  Optional: Your identification number for verification
                </p>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">
                  Email cannot be changed. Contact SuperAdmin if needed.
                </p>
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={currentUser.role}
                  disabled
                  className="bg-slate-50 capitalize"
                />
                <p className="text-xs text-slate-500">
                  Role is managed by SuperAdmin
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName(currentUser.name);
                    setContact(currentUser.contact || '');
                    setIdNumber(currentUser.id_number || '');
                    setProfilePicture(currentUser.profile_picture || '');
                    setPreviewImage(currentUser.profile_picture || '');
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
