# Worker Verification Badges - Quick Start Guide

## 30-Second Setup

### 1. Run Migration
```bash
python add_verification_badges.py
```

### 2. Restart Backend
```bash
# Backend should automatically pick up the new router
# No code changes needed - already integrated in app/main.py
```

### 3. Use in Frontend

**Display badges on worker cards:**
```jsx
import VerificationBadges from './components/VerificationBadges';

// In your worker display component
<VerificationBadges worker={worker} size="md" />
```

**Admin verification management:**
```jsx
import VerificationManager from './components/VerificationManager';

// In your admin dashboard
<VerificationManager workerId={123} onUpdate={handleRefresh} />
```

## Badge Types at a Glance

| Badge | Requirement | Color |
|-------|-------------|-------|
| 📧 Email Verified | Email confirmed | Blue |
| 📱 Phone Verified | Phone confirmed | Green |
| 🛡️ Identity Verified | ID verified | Purple |
| ✓ Background Checked | Background check passed | Amber |
| ⭐ Verified Worker | 20+ projects & 4.0+ rating | Yellow |

## API Endpoints

```
GET    /verification/workers/{id}/badges          # Get all badges
PATCH  /verification/workers/{id}/email           # Verify email
PATCH  /verification/workers/{id}/phone           # Verify phone
PATCH  /verification/workers/{id}/identity        # Verify identity
PATCH  /verification/workers/{id}/background      # Verify background
PATCH  /verification/workers/{id}/revoke/{type}   # Revoke badge
```

## Component Props

### VerificationBadges
```jsx
<VerificationBadges 
  worker={workerObject}      // Required: worker data
  size="md"                  // Optional: 'sm', 'md', 'lg'
/>
```

### VerificationManager
```jsx
<VerificationManager 
  workerId={123}             // Required: worker ID
  onUpdate={handleUpdate}    // Optional: callback on change
/>
```

## Common Tasks

### Display badges on worker card
```jsx
<div className="worker-card">
  <h3>{worker.full_name}</h3>
  <VerificationBadges worker={worker} size="sm" />
</div>
```

### Show verification status in admin panel
```jsx
<div className="admin-panel">
  <h2>Manage Worker Verifications</h2>
  <VerificationManager workerId={workerId} onUpdate={refreshWorker} />
</div>
```

### Check if worker is verified
```jsx
const isVerified = 
  (worker.projects_completed || 0) >= 20 && 
  (worker.client_rating || 0) >= 4.0;

if (isVerified) {
  // Show special badge or highlight
}
```

### Get all badges for a worker
```javascript
const response = await fetch(
  `http://127.0.0.1:8000/verification/workers/${workerId}/badges`
);
const data = await response.json();
console.log(data.badges); // { email_verified: true, ... }
```

## Styling

Badges automatically use Tailwind classes:
- Blue: `bg-blue-100 text-blue-700 border-blue-300`
- Green: `bg-green-100 text-green-700 border-green-300`
- Purple: `bg-purple-100 text-purple-700 border-purple-300`
- Amber: `bg-amber-100 text-amber-700 border-amber-300`
- Yellow: `bg-yellow-100 text-yellow-700 border-yellow-300`

Custom CSS classes also available in `index.css`:
- `.verification-badge`
- `.verification-badge-email`
- `.verification-badge-phone`
- `.verification-badge-identity`
- `.verification-badge-background`
- `.verification-badge-verified-worker`

## Testing

```bash
# Run test suite
python test_verification_system.py

# Test specific endpoint
curl http://127.0.0.1:8000/verification/workers/1/badges
```

## Troubleshooting

**Badges not showing?**
- Check if worker has any verified badges
- Run migration: `python add_verification_badges.py`
- Verify worker data is loaded

**Verification endpoints return 403?**
- Ensure user is logged in
- Check user has admin/company role
- Verify token is valid

**Migration fails?**
- Check database connection
- Ensure SQLAlchemy is installed
- Check database permissions

## Files Reference

| File | Purpose |
|------|---------|
| `app/routers/verification.py` | Backend API endpoints |
| `add_verification_badges.py` | Database migration |
| `frontend/src/components/VerificationBadges.jsx` | Badge display component |
| `frontend/src/components/VerificationManager.jsx` | Admin management UI |
| `VERIFICATION_BADGES_GUIDE.md` | Full documentation |
| `test_verification_system.py` | Test suite |

## Next Steps

1. ✅ Run migration
2. ✅ Restart backend
3. ✅ Add VerificationBadges to worker cards
4. ✅ Add VerificationManager to admin dashboard
5. ✅ Test with `test_verification_system.py`
6. ✅ Deploy to production

## Need Help?

- Full docs: `VERIFICATION_BADGES_GUIDE.md`
- Examples: `test_verification_system.py`
- Implementation details: `VERIFICATION_IMPLEMENTATION_SUMMARY.md`
