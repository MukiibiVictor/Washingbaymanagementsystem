import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { footerApi } from '../lib/api-service';
import { toast } from 'sonner';
import zeroLogo from '../../assets/7c8b52700404010ef9d70a93ba8a793d0656723b.png';

interface FooterData {
  id: string;
  company_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function Footer() {
  const { user } = useAuth();
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<FooterData>>({});
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    const data = await footerApi.get();
    setFooterData(data);
  };

  const handleEdit = () => {
    setEditData(footerData || {});
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await footerApi.update(editData);
    if (result.success) {
      toast.success('Footer updated successfully');
      setEditDialogOpen(false);
      loadFooterData();
    } else {
      toast.error('Failed to update footer');
    }
    setSaving(false);
  };

  if (!footerData) return null;

  return (
    <>
      <footer className="bg-slate-900 dark:bg-[#0a1628] border-t border-slate-800 dark:border-[#1e3a5f] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={zeroLogo} alt="ZORI Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-xl font-bold text-white">{footerData.company_name}</h3>
                  <p className="text-sm text-slate-400">{footerData.tagline}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">{footerData.description}</p>
              {isSuperAdmin && (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Footer
                </Button>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href={`mailto:${footerData.email}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {footerData.email}
                </a>
                <a
                  href={`tel:${footerData.phone}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {footerData.phone}
                </a>
                {footerData.address && (
                  <div className="flex items-start gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{footerData.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/services" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Our Services
                </a>
                <a href="/pricing" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Pricing
                </a>
                {user && (
                  <>
                    {(user.role === 'superadmin' || user.role === 'admin') && (
                      <>
                        <a href="/" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                          Dashboard
                        </a>
                        <a href="/reports" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                          Reports
                        </a>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 dark:border-[#1e3a5f] mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {footerData.company_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Edit Dialog */}
      {isSuperAdmin && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Footer Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={editData.company_name || ''}
                    onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                    placeholder="ZORI auto spa"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tagline</label>
                  <Input
                    value={editData.tagline || ''}
                    onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
                    placeholder="flawless shine, water with luxury"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Brief description about your company"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+256 XXX XXX XXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editData.address || ''}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  placeholder="Your business address"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
