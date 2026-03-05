# Backend Integration Guide

This React frontend is ready to connect to your Django backend. Follow these steps:

## 🔌 Connecting to Django Backend

### 1. Update API Endpoints

Replace the mock API in `/src/app/lib/mock-api.ts` with real API calls:

```typescript
// Example: Replace mock checkInsApi with real API
export const checkInsApi = {
  getPending: async (): Promise<CheckIn[]> => {
    const response = await fetch('http://your-django-api.com/api/checkins?status=pending', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  confirm: async (id: string, data: any, adminName: string) => {
    const response = await fetch(`http://your-django-api.com/api/checkins/${id}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### 2. Update Authentication

Replace the mock authentication in `/src/app/lib/auth-context.tsx`:

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('http://your-django-api.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

### 3. Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api
```

Then use it in your code:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## 📋 Django Backend Requirements

Your Django backend should provide these endpoints:

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/logout` - User logout

### Check-ins
- `GET /api/checkins` - List all check-ins
- `GET /api/checkins?status=pending` - List pending check-ins
- `POST /api/checkins` - Create check-in (camera upload)
- `POST /api/checkins/{id}/confirm` - Confirm check-in

### Transactions
- `GET /api/transactions` - List all transactions
- `GET /api/transactions?status=pending` - Pending transactions
- `GET /api/transactions?status=credit` - Credit transactions
- `GET /api/transactions/{id}` - Get single transaction

### Payments
- `POST /api/transactions/{id}/payment` - Record payment
- `GET /api/payments` - List all payments

### Pricing Rules
- `GET /api/pricing-rules` - List all pricing rules
- `PUT /api/pricing-rules/{id}` - Update pricing rule

### Dashboard
- `GET /api/reports/daily` - Daily statistics

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user (SuperAdmin only)
- `PUT /api/users/{id}` - Update user

## 🔒 CORS Configuration

In your Django settings:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://your-production-domain.com",
]
```

## 📸 Image Storage

For camera uploads, configure Django to handle multipart/form-data:

```python
# Django view example
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def camera_upload(request):
    camera_id = request.POST.get('camera_id')
    image = request.FILES.get('image')
    
    # Save to local storage or S3
    checkin = CheckIn.objects.create(
        camera_id=camera_id,
        image=image,
        status='pending'
    )
    
    return Response({
        'id': checkin.id,
        'image_url': checkin.image.url,
        'timestamp': checkin.timestamp,
    })
```

## 🎯 Current Demo Credentials

The frontend currently has these demo accounts (update once Django is connected):

- **SuperAdmin**: admin@zoriautospa.com / admin123
- **Admin**: staff@zoriautospa.com / staff123
- **Viewer**: viewer@zoriautospa.com / viewer123

## 📊 Data Models Match

The TypeScript types in `/src/app/lib/types.ts` match your Django models. Ensure your serializers return data in this format.

## 🚀 Production Deployment

1. Build the frontend: `npm run build`
2. Serve the `dist` folder via Django's static files or a CDN
3. Update `VITE_API_URL` to your production API URL
