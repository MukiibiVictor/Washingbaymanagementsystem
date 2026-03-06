import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, Sparkles, Car, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/auth-context';
import { servicesApi } from '../lib/api-service';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image_url?: string;
  price_range: string;
  duration: string;
  created_at: string;
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [duration, setDuration] = useState('');

  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setTitle(service.title);
      setDescription(service.description);
      setFeatures(service.features.join('\n'));
      setImageUrl(service.image_url || '');
      setPriceRange(service.price_range);
      setDuration(service.duration);
    } else {
      setEditingService(null);
      setTitle('');
      setDescription('');
      setFeatures('');
      setImageUrl('');
      setPriceRange('');
      setDuration('');
    }
    setDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!title || !description || !priceRange || !duration) {
      toast.error('Please fill all required fields');
      return;
    }

    const serviceData = {
      title,
      description,
      features: features.split('\n').filter(f => f.trim()),
      image_url: imageUrl,
      price_range: priceRange,
      duration,
    };

    const result = editingService
      ? await servicesApi.update(editingService.id, serviceData)
      : await servicesApi.create(serviceData);

    if (result.success) {
      setDialogOpen(false);
      loadServices();
      toast.success(editingService ? 'Service updated' : 'Service added');
    } else {
      toast.error('Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const result = await servicesApi.delete(id);
    if (result.success) {
      loadServices();
      toast.success('Service deleted');
    } else {
      toast.error('Failed to delete service');
    }
  };

  const getServiceIcon = (index: number) => {
    const icons = [Sparkles, Car, Shield];
    const Icon = icons[index % icons.length];
    return <Icon className="w-8 h-8" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Professional auto spa services for every vehicle
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        )}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="text-center py-12">
            <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No services available</p>
            <p className="text-sm text-slate-500 mt-1">
              {isSuperAdmin ? 'Add your first service to get started' : 'Check back soon for our services'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={service.id} className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              {service.image_url && (
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {getServiceIcon(index)}
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 dark:text-slate-100">{service.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {service.price_range}
                      </Badge>
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(service)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                
                {service.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Duration:</span> {service.duration}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Service Dialog */}
      {isSuperAdmin && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Premium Full Detail"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  placeholder="Interior cleaning&#10;Exterior wash&#10;Wax application"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range *</Label>
                  <Input
                    id="priceRange"
                    placeholder="e.g. 10,000 - 50,000 UGX"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 1-2 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.alt = 'Invalid image URL';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveService}>
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
