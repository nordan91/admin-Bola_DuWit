# UMKM Workflow Implementation

## Overview
This document describes the improved UMKM (Micro, Small, and Medium Enterprises) registration and approval workflow.

## New Workflow

### 1. UMKM Registration
- User registers with role "umkm"
- Status automatically set to "pending"
- User cannot login initially (blocked by middleware)

### 2. Profile Completion (NEW)
- **Pending UMKM users can now login** to complete their profile
- Login response includes `requires_profile: true` flag
- Users can create/update their UMKM profile
- Profile includes: store name, description, address, coordinates, WhatsApp contact

### 3. Admin Approval
- Admin can view all pending UMKM users with their profile data
- Admin sees which users have completed profiles vs. those who haven't
- Admin approves/rejects applications
- Upon approval: status changes to "active" and profile becomes "verified"

### 4. Full Access
- Only active UMKM users can:
  - Add/manage products
  - Toggle store status (open/closed)
  - Process transactions

## API Endpoints

### Authentication
```
POST /api/users/login
```
- **Pending UMKM users**: Can login, receive `requires_profile: true`
- **Active UMKM users**: Normal login
- **Rejected users**: Blocked

### Profile Management (Available for pending + active UMKM)
```
GET    /api/umkm/profile     - View profile
POST   /api/umkm/profile     - Create profile
PUT    /api/umkm/profile     - Update profile
```

### Store Management (Active UMKM only)
```
POST   /api/umkm/toggle-store - Open/close store
```

### Product Management (Active UMKM only)
```
GET    /api/produk           - List products
POST   /api/produk           - Add product
GET    /api/produk/{id}      - View product
PUT    /api/produk/{id}      - Update product
DELETE /api/produk/{id}      - Delete product
```

### Admin Endpoints
```
GET    /api/admin/pending-umkm    - View pending UMKM with profiles
POST   /api/admin/approve-umkm/{id} - Approve UMKM
POST   /api/admin/reject-umkm/{id}  - Reject UMKM
```

## Testing Data

Run the seeder to create test data:
```bash
php artisan db:seed --class=UmkmSeeder
```

### Test Accounts
- **Pending UMKM (no profile)**: `umkm.pending@example.com` / `password123`
- **Pending UMKM (with profile)**: `umkm.profile@example.com` / `password123`
- **Active UMKM**: `umkm.active@example.com` / `password123`

## Frontend Implementation Notes

### Login Response Handling
```javascript
// After login
if (response.data.requires_profile) {
  // Redirect to profile completion page
  navigate('/umkm/profile/setup');
} else if (user.role === 'umkm' && user.status === 'active') {
  // Redirect to UMKM dashboard
  navigate('/umkm/dashboard');
}
```

### Profile Completion Flow
1. Check if user has profile: `GET /api/umkm/profile`
2. If no profile: Show form to create profile
3. If has profile: Show form to update profile
4. After profile completion: Show message to wait for admin approval

### Admin Panel
- Display pending UMKM users with profile completion status
- Show profile details for decision making
- Approve/reject with appropriate actions

## Security Considerations

- Profile management requires authentication + UMKM role
- Product management requires additional "active" status check
- Admin endpoints require "admin" role
- All endpoints validate user ownership of resources

## Migration Notes

- Existing UMKM users with "pending" status can now login
- Admin can see profile completion status
- No breaking changes to existing active UMKM functionality