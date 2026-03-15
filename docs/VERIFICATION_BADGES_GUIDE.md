# Worker Verification Badges System

## Overview

The Worker Verification Badges system provides a comprehensive way to display worker credibility and verification status. It includes multiple verification types and a "Verified Worker" badge based on performance metrics.

## Verification Badge Types

### 1. Email Verified ✉️
- **Icon**: Mail
- **Color**: Blue
- **Requirement**: Email address verified
- **Field**: `is_email_verified` (Boolean)

### 2. Phone Verified ☎️
- **Icon**: Phone
- **Color**: Green
- **Requirement**: Phone number verified
- **Field**: `is_phone_verified` (Boolean)

### 3. Identity Verified 🛡️
- **Icon**: Shield
- **Color**: Purple
- **Requirement**: Government ID verified
- **Field**: `is_identity_verified` (Boolean)

### 4. Background Checked ✓
- **Icon**: CheckCircle
- **Color**: Amber
- **Requirement**: Background check passed
- **Field**: `is_background_checked` (Boolean)

### 5. Verified Worker ⭐
- **Icon**: Award
- **Color**: Yellow
- **Requirements**: 
  - 20+ projects completed
  - Rating ≥ 4.0 stars
- **Computed**: Automatically calculated from `projects_completed` and `client_rating`

## Database Schema

### Resume Model Fields

```python
# Verification fields (all Boolean, default False)
is_email_verified = Column(Boolean, default=False)
is_phone_verified = Column(Boolean, default=False)
is_identity_verified = Column(Boolean, default=False)
is_background_checked = Column(Boolean, default=False)

# Performance metrics (for Verified Worker badge)
projects_completed = Column(Integer, nullable=True)
client_rating = Column(Float, default=0.0)
```

## API Endpoints

### Get Worker Badges
```
GET /verification/workers/{worker_id}/badges
```

**Response:**
```json
{
  "worker_id": 1,
  "badges": {
    "email_verified": true,
    "phone_verified": true,
    "identity_verified": false,
    "background_checked": true,
    "verified_worker": true
  },
  "total_verified": 4
}
```

### Verify Email
```
PATCH /verification/workers/{worker_id}/email
Authorization: Bearer {token}
```

### Verify Phone
```
PATCH /verification/workers/{worker_id}/phone
Authorization: Bearer {token}
```

### Verify Identity
```
PATCH /verification/workers/{worker_id}/identity
Authorization: Bearer {token}
```

### Verify Background
```
PATCH /verification/workers/{worker_id}/background
Authorization: Bearer {token}
```

### Revoke Verification
```
PATCH /verification/workers/{worker_id}/revoke/{badge_type}
Authorization: Bearer {token}
```

**Badge Types for Revoke:**
- `email`
- `phone`
- `identity`
- `background`

## Frontend Components

### VerificationBadges Component

Displays verification badges for a worker.

**Props:**
- `worker` (Object): Worker data object
- `size` (String): Badge size - 'sm', 'md', 'lg' (default: 'md')

**Usage:**
```jsx
import VerificationBadges from './components/VerificationBadges';

<VerificationBadges worker={workerData} size="md" />
```

**Features:**
- Responsive sizing
- Only shows verified badges
- Hover effects
- Icon + label display
- Mobile-optimized (hides labels on small screens)

### VerificationManager Component

Admin interface for managing worker verification badges.

**Props:**
- `workerId` (Number): Worker ID
- `onUpdate` (Function): Callback when verification changes

**Usage:**
```jsx
import VerificationManager from './components/VerificationManager';

<VerificationManager workerId={123} onUpdate={handleUpdate} />
```

**Features:**
- View all verification statuses
- Verify/revoke badges
- Loading states
- Error handling
- Confirmation dialogs

## Integration Points

### WorkerCard Component
- Displays verification badges in grid view
- Shows "Verified" badge in header if worker qualifies
- Size: 'sm' for compact display

### WorkerDetail Component
- Can integrate VerificationManager for admin users
- Shows full verification status
- Displays badge details

### MyWorkers Component (Company Dashboard)
- Shows verification status of hired workers
- Helps companies identify trusted workers

## Migration

Run the migration script to ensure all verification fields exist:

```bash
python add_verification_badges.py
```

This script:
- Checks if verification fields exist in the database
- Adds missing fields with default value of False
- Handles errors gracefully

## Testing

Run the test suite:

```bash
python test_verification_system.py
```

Tests include:
- Getting worker badges
- Email verification
- Phone verification
- Identity verification
- Background check verification
- Revoking verifications
- Fetching updated badges

## Usage Examples

### Display Badges in Worker List
```jsx
import VerificationBadges from './components/VerificationBadges';

function WorkerList({ workers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workers.map(worker => (
        <div key={worker.id} className="card">
          <h3>{worker.full_name}</h3>
          <VerificationBadges worker={worker} size="md" />
        </div>
      ))}
    </div>
  );
}
```

### Admin Verification Management
```jsx
import VerificationManager from './components/VerificationManager';

function AdminWorkerDetail({ workerId }) {
  const handleUpdate = () => {
    // Refresh worker data
    fetchWorkerData();
  };

  return (
    <div>
      <h2>Manage Verifications</h2>
      <VerificationManager workerId={workerId} onUpdate={handleUpdate} />
    </div>
  );
}
```

### Check Verified Worker Status
```jsx
function WorkerCard({ worker }) {
  const isVerifiedWorker = 
    (worker.projects_completed || 0) >= 20 && 
    (worker.client_rating || 0) >= 4.0;

  return (
    <div>
      {isVerifiedWorker && (
        <span className="badge badge-gold">Verified Worker</span>
      )}
    </div>
  );
}
```

## Best Practices

1. **Verification Flow**
   - Email verification should be automatic on signup
   - Phone verification should be automatic on profile creation
   - Identity and background checks require manual admin review

2. **Display Strategy**
   - Show badges prominently on worker profiles
   - Use consistent colors and icons
   - Only show verified badges (hide unverified)

3. **Performance**
   - Cache badge status with worker data
   - Fetch badges separately if needed
   - Use computed properties for "Verified Worker"

4. **Security**
   - Only admins/companies can modify verification status
   - Require authentication for verification endpoints
   - Log all verification changes

## Future Enhancements

- [ ] Automated email verification via OTP
- [ ] Automated phone verification via SMS
- [ ] Integration with identity verification services
- [ ] Background check API integration
- [ ] Verification expiration dates
- [ ] Verification history/audit log
- [ ] Badge-based filtering in search
- [ ] Verification level indicators (bronze/silver/gold)

## Troubleshooting

### Badges Not Showing
1. Check if worker has any verified badges
2. Verify database fields exist (run migration)
3. Check worker data is loaded correctly

### Verification Endpoints Returning 403
1. Ensure user has admin/company role
2. Check authentication token is valid
3. Verify user is logged in

### Migration Errors
1. Check database connection
2. Ensure SQLAlchemy is installed
3. Check database permissions

## Support

For issues or questions about the verification system:
1. Check this documentation
2. Review test_verification_system.py for examples
3. Check browser console for frontend errors
4. Check server logs for backend errors
