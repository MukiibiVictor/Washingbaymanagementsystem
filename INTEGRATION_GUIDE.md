# Integration Guide

## Manual Vehicle Check-in with Camera Capture

### Overview
The system now supports manual vehicle entry when cameras are offline. Users can capture photos using their device camera and manually enter vehicle details.

### Features Implemented

#### 1. Camera Capture
- Live camera preview using MediaDevices API
- Photo capture and retake functionality
- Automatic camera cleanup on dialog close
- Support for both front and rear cameras (prefers rear/environment camera)

#### 2. Manual Entry Form
- Plate number input (auto-uppercase)
- Vehicle type selection (Sedan, SUV, Lorry, Fuso)
- Service type selection (Wash, Wash & Wax, Full Detail, Interior Only)
- Price input with minimum price validation
- Real-time minimum price display based on vehicle and service type

#### 3. Base64 Image Support
- Updated `checkInsApi.upload()` to accept both File objects and base64 strings
- Camera captures are converted to base64 format
- Seamless integration with existing check-in flow

#### 4. Immediate Transaction Creation
- Manual entries create a check-in and immediately confirm it as a transaction
- Single-step process for faster data entry
- Transaction appears immediately in all relevant pages

### Real-Time Data Updates

#### Event System
Created a simple event emitter system (`src/app/lib/events.ts`) that enables real-time updates across all pages.

#### Supported Events
- `TRANSACTION_CREATED` - When a new transaction is created
- `TRANSACTION_UPDATED` - When a transaction status changes
- `PAYMENT_CREATED` - When a payment is recorded
- `CHECKIN_CREATED` - When a new check-in is uploaded
- `CHECKIN_CONFIRMED` - When a check-in is confirmed

#### Pages with Real-Time Updates
1. **DashboardPage** - Automatically refreshes stats when transactions/payments change
2. **TransactionsPage** - Updates transaction lists in real-time
3. **CheckInsPage** - Refreshes pending check-ins when new ones are created or confirmed

### How It Works

#### Manual Entry Flow
1. User clicks "Manual Entry" button on Check-ins page
2. Camera preview starts automatically
3. User captures photo of vehicle
4. User can retake photo if needed
5. User fills in vehicle details (plate, type, service, price)
6. System validates minimum price
7. On submit:
   - Creates check-in with captured image (base64)
   - Immediately confirms check-in as transaction
   - Emits events for real-time updates
   - All pages refresh automatically

#### Real-Time Update Flow
1. User action triggers data change (e.g., manual entry, payment)
2. API function emits relevant event(s)
3. All subscribed pages receive event notification
4. Pages automatically reload their data
5. UI updates without manual refresh

### Usage

#### For Admins/SuperAdmins
- Access "Manual Entry" button on Check-ins page
- Grant camera permissions when prompted
- Capture vehicle photo
- Enter vehicle details
- Submit to create transaction

#### Camera Permissions
- Browser will request camera access on first use
- User must grant permission for camera to work
- If denied, user will see error message
- Permissions can be reset in browser settings

### Technical Details

#### API Changes
```typescript
// Before: Only accepted File objects
upload: async (cameraId: number, imageFile: File): Promise<CheckIn>

// After: Accepts both File objects and base64 strings
upload: async (cameraId: number, imageFile: File | string): Promise<CheckIn>
```

#### Event Subscription Pattern
```typescript
useEffect(() => {
  const handleDataChange = () => {
    loadData();
  };

  dataEvents.on(DATA_EVENTS.TRANSACTION_CREATED, handleDataChange);

  return () => {
    dataEvents.off(DATA_EVENTS.TRANSACTION_CREATED, handleDataChange);
  };
}, []);
```

### Browser Compatibility
- Camera API requires HTTPS in production
- Works on localhost for development
- Supported on modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers fully supported

### Future Enhancements
- Add image compression for base64 images
- Store images in backend/cloud storage
- Add offline support with service workers
- Implement image quality validation
- Add multiple photo capture per vehicle
