import { useEffect, useState } from 'react';
import { CheckIn, VehicleType, ServiceType } from '../lib/types';
import { checkInsApi, pricingRulesApi } from '../lib/mock-api';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { formatTimeAgo, formatCurrency } from '../lib/utils';
import { Camera, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

const VEHICLE_TYPES: VehicleType[] = ['Sedan', 'SUV', 'Lorry', 'Fuso'];
const SERVICE_TYPES: ServiceType[] = ['Wash', 'Wash & Wax', 'Full Detail', 'Interior Only'];

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { user } = useAuth();

  // Confirm form state
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [serviceType, setServiceType] = useState<ServiceType>('Wash');
  const [price, setPrice] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [confirming, setConfirming] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCheckIns();
  }, []);

  useEffect(() => {
    // Update minimum price when vehicle/service type changes
    loadMinPrice();
  }, [vehicleType, serviceType]);

  const loadCheckIns = async () => {
    setLoading(true);
    const data = await checkInsApi.getPending();
    setCheckIns(data);
    setLoading(false);
  };

  const loadMinPrice = async () => {
    const rules = await pricingRulesApi.getAll();
    const rule = rules.find((r) => r.vehicle_type === vehicleType && r.service_type === serviceType);
    setMinPrice(rule?.minimum_price || 0);
  };

  const handleConfirmClick = (checkIn: CheckIn) => {
    setSelectedCheckIn(checkIn);
    setVehicleType('Sedan');
    setServiceType('Wash');
    setPrice('');
    setPlateNumber('');
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedCheckIn || !user) return;

    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!plateNumber.trim()) {
      toast.error('Please enter plate number');
      return;
    }

    setConfirming(true);

    const result = await checkInsApi.confirm(
      selectedCheckIn.id,
      {
        vehicle_type: vehicleType,
        service_type: serviceType,
        price: priceNum,
        plate_number: plateNumber,
      },
      user.name
    );

    if (result.success) {
      toast.success('Vehicle check-in confirmed successfully');
      setConfirmDialogOpen(false);
      loadCheckIns();
    } else {
      toast.error(result.error || 'Failed to confirm check-in');
    }

    setConfirming(false);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      await checkInsApi.upload(1, uploadFile);
      toast.success('Camera image uploaded successfully');
      setUploadDialogOpen(false);
      setUploadFile(null);
      loadCheckIns();
    } catch (error) {
      toast.error('Failed to upload image');
    }

    setUploading(false);
  };

  const canConfirm = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Pending Check-ins</h1>
          <p className="text-sm text-slate-500 mt-1">Camera uploads awaiting confirmation</p>
        </div>
        {canConfirm && (
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Simulate Camera Upload
          </Button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : checkIns.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-900">No pending check-ins</p>
              <p className="text-sm text-slate-500 mt-1">
                Waiting for camera uploads or all check-ins have been processed
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checkIns.map((checkIn) => (
            <Card key={checkIn.id} className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-700">Check-in #{checkIn.id}</CardTitle>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {checkIn.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-300 transition-all">
                  <img src={checkIn.image_url} alt="Vehicle" className="w-full h-full object-cover hover:scale-110 transition-all" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm hover:bg-slate-50 p-2 rounded transition-all">
                    <span className="text-slate-500">Camera ID:</span>
                    <span className="font-medium text-slate-900">{checkIn.camera_id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm hover:bg-slate-50 p-2 rounded transition-all">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-medium text-slate-900">{formatTimeAgo(checkIn.timestamp)}</span>
                  </div>
                </div>
                {canConfirm && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleConfirmClick(checkIn)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Service
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Vehicle Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCheckIn && (
              <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                <img
                  src={selectedCheckIn.image_url}
                  alt="Vehicle"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="plate">Plate Number</Label>
              <Input
                id="plate"
                placeholder="e.g. UBR123A"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
                <SelectTrigger id="vehicle-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                <SelectTrigger id="service-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (UGX)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {minPrice > 0 && (
                <p className="text-xs text-gray-500">Minimum: {formatCurrency(minPrice)}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmSubmit} disabled={confirming}>
                {confirming ? 'Confirming...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simulate Camera Upload</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a vehicle image to simulate a camera check-in. In production, this would be an automated
              API endpoint.
            </p>
            <div className="space-y-2">
              <Label htmlFor="upload">Select Image</Label>
              <Input
                id="upload"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setUploadDialogOpen(false);
                  setUploadFile(null);
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUploadSubmit} disabled={uploading || !uploadFile}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
