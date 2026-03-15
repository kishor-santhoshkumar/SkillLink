# Worker Verification Badges - Integration Examples

## Integration into Existing Components

### 1. WorkerCard Component

**Current state:** Already has VerificationBadges integrated

**Location:** `frontend/src/components/WorkerCard.jsx` (line ~130)

```jsx
{/* Badges */}
<div className="mb-4">
  <VerificationBadges worker={worker} size="sm" />
</div>
```

**What it does:**
- Displays verification badges in small size
- Only shows verified badges
- Responsive on mobile

---

### 2. WorkerDetail Component

**Add verification badges to the profile header:**

```jsx
// Add import
import VerificationBadges from '../../components/VerificationBadges';

// In the JSX, after the worker name and trade
<div className="mt-4">
  <VerificationBadges worker={worker} size="md" />
</div>
```

**Example placement:**
```jsx
<div className="max-w-5xl mx-auto px-4 py-8">
  {/* Back Button */}
  <button onClick={() => navigate(-1)}>← Back</button>
  
  {/* Worker Header */}
  <div className="flex gap-6">
    <img src={photoUrl} alt={worker.full_name} className="w-32 h-32 rounded-full" />
    <div>
      <h1>{worker.full_name}</h1>
      <p className="text-lg text-blue-600">{worker.primary_trade}</p>
      
      {/* ADD HERE */}
      <div className="mt-4">
        <VerificationBadges worker={worker} size="md" />
      </div>
    </div>
  </div>
</div>
```

---

### 3. MyWorkers Component (Company Dashboard)

**Add verification status to hired workers list:**

```jsx
// Add import
import VerificationBadges from '../../components/VerificationBadges';

// In the worker list rendering
{workers.map(worker => (
  <div key={worker.id} className="worker-item">
    <div className="flex justify-between items-start">
      <div>
        <h3>{worker.full_name}</h3>
        <p>{worker.primary_trade}</p>
        
        {/* ADD HERE */}
        <div className="mt-2">
          <VerificationBadges worker={worker} size="sm" />
        </div>
      </div>
      
      <div className="status-badge">
        {worker.status}
      </div>
    </div>
  </div>
))}
```

---

### 4. SearchWorkers Component

**Add verification badges to search results:**

```jsx
// Add import
import VerificationBadges from '../../components/VerificationBadges';

// In the search results grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {searchResults.map(worker => (
    <div key={worker.id} className="card">
      <div className="card-header">
        <h3>{worker.full_name}</h3>
        <p className="text-sm text-gray-600">{worker.primary_trade}</p>
      </div>
      
      {/* ADD HERE */}
      <div className="card-body">
        <VerificationBadges worker={worker} size="sm" />
      </div>
      
      <div className="card-footer">
        <button>View Profile</button>
      </div>
    </div>
  ))}
</div>
```

---

### 5. Admin Dashboard - Worker Management

**Add verification management interface:**

```jsx
// Add imports
import VerificationBadges from '../../components/VerificationBadges';
import VerificationManager from '../../components/VerificationManager';

// In admin worker detail page
function AdminWorkerDetail({ workerId }) {
  const [worker, setWorker] = useState(null);

  const handleVerificationUpdate = () => {
    // Refresh worker data
    fetchWorkerData();
  };

  return (
    <div className="admin-panel">
      <h1>Worker Management</h1>
      
      {/* Worker Info */}
      <div className="worker-info">
        <h2>{worker?.full_name}</h2>
        <VerificationBadges worker={worker} size="md" />
      </div>
      
      {/* Verification Management */}
      <div className="verification-section">
        <h3>Manage Verifications</h3>
        <VerificationManager 
          workerId={workerId} 
          onUpdate={handleVerificationUpdate}
        />
      </div>
    </div>
  );
}
```

---

### 6. Worker Profile Page

**Add verification badges to public profile:**

```jsx
// Add import
import VerificationBadges from '../components/VerificationBadges';

// In the profile header
<div className="profile-header">
  <div className="profile-photo">
    <img src={photoUrl} alt={worker.full_name} />
  </div>
  
  <div className="profile-info">
    <h1>{worker.full_name}</h1>
    <p className="trade">{worker.primary_trade}</p>
    
    {/* ADD HERE */}
    <div className="verification-section">
      <VerificationBadges worker={worker} size="md" />
    </div>
    
    <div className="rating">
      <Stars rating={worker.client_rating} />
      <span>{worker.client_rating}/5.0</span>
    </div>
  </div>
</div>
```

---

### 7. Worker List (Homepage)

**Add verification badges to featured workers:**

```jsx
// Add import
import VerificationBadges from '../components/VerificationBadges';

// In the featured workers section
<div className="featured-workers">
  <h2>Top Verified Workers</h2>
  
  <div className="workers-grid">
    {topWorkers.map(worker => (
      <div key={worker.id} className="worker-card">
        <img src={getPhotoUrl(worker.profile_photo)} alt={worker.full_name} />
        
        <h3>{worker.full_name}</h3>
        <p>{worker.primary_trade}</p>
        
        {/* ADD HERE */}
        <VerificationBadges worker={worker} size="sm" />
        
        <div className="rating">
          <Stars rating={worker.client_rating} />
        </div>
        
        <button>View Profile</button>
      </div>
    ))}
  </div>
</div>
```

---

### 8. Notification Component

**Show verification status in notifications:**

```jsx
// Add import
import VerificationBadges from '../components/VerificationBadges';

// In notification rendering
<div className="notification">
  <div className="notification-header">
    <h4>{notification.title}</h4>
    <span className="time">{formatTime(notification.created_at)}</span>
  </div>
  
  <p>{notification.message}</p>
  
  {/* If notification is about a worker */}
  {notification.worker && (
    <div className="notification-worker">
      <p>Worker: {notification.worker.full_name}</p>
      <VerificationBadges worker={notification.worker} size="sm" />
    </div>
  )}
</div>
```

---

## Styling Integration

### Using Custom CSS Classes

```jsx
// Instead of inline Tailwind, use custom classes
<div className="verification-badges-container md">
  <VerificationBadges worker={worker} size="md" />
</div>
```

### Custom Styling Example

```css
/* In your component's CSS file */
.worker-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.worker-card .verification-badges-container {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}
```

---

## API Integration Examples

### Fetch and Display Badges

```jsx
import { useEffect, useState } from 'react';
import VerificationBadges from '../components/VerificationBadges';

function WorkerProfile({ workerId }) {
  const [worker, setWorker] = useState(null);
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    // Fetch worker data
    fetchWorker();
    // Fetch badges separately if needed
    fetchBadges();
  }, [workerId]);

  const fetchWorker = async () => {
    const response = await fetch(`/workers/${workerId}`);
    setWorker(await response.json());
  };

  const fetchBadges = async () => {
    const response = await fetch(`/verification/workers/${workerId}/badges`);
    setBadges(await response.json());
  };

  return (
    <div>
      {worker && <VerificationBadges worker={worker} size="md" />}
      {badges && (
        <div className="badge-stats">
          <p>Total Verified: {badges.total_verified}</p>
        </div>
      )}
    </div>
  );
}
```

### Admin Verification Flow

```jsx
import { useState } from 'react';
import VerificationManager from '../components/VerificationManager';

function AdminWorkerDetail({ workerId }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVerificationUpdate = () => {
    // Trigger re-render of worker data
    setRefreshKey(prev => prev + 1);
    // Optionally fetch updated worker data
    fetchWorkerData();
  };

  return (
    <div>
      <h2>Manage Worker Verifications</h2>
      <VerificationManager 
        key={refreshKey}
        workerId={workerId} 
        onUpdate={handleVerificationUpdate}
      />
    </div>
  );
}
```

---

## Responsive Design Integration

### Mobile-First Approach

```jsx
// Use size prop for responsive display
<div className="hidden sm:block">
  {/* Desktop: medium size badges */}
  <VerificationBadges worker={worker} size="md" />
</div>

<div className="sm:hidden">
  {/* Mobile: small size badges */}
  <VerificationBadges worker={worker} size="sm" />
</div>
```

### Tailwind Responsive Classes

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {workers.map(worker => (
    <div key={worker.id} className="card">
      <h3>{worker.full_name}</h3>
      
      {/* Responsive badge sizing */}
      <div className="mt-4">
        <VerificationBadges 
          worker={worker} 
          size="sm" 
        />
      </div>
    </div>
  ))}
</div>
```

---

## Performance Optimization

### Memoization

```jsx
import { memo } from 'react';
import VerificationBadges from '../components/VerificationBadges';

// Memoize to prevent unnecessary re-renders
const WorkerCardMemo = memo(({ worker }) => (
  <div className="card">
    <h3>{worker.full_name}</h3>
    <VerificationBadges worker={worker} size="sm" />
  </div>
));

export default WorkerCardMemo;
```

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

const VerificationBadges = lazy(() => 
  import('../components/VerificationBadges')
);

function WorkerCard({ worker }) {
  return (
    <div className="card">
      <h3>{worker.full_name}</h3>
      <Suspense fallback={<div>Loading badges...</div>}>
        <VerificationBadges worker={worker} size="sm" />
      </Suspense>
    </div>
  );
}
```

---

## Testing Integration

### Component Testing

```jsx
import { render, screen } from '@testing-library/react';
import VerificationBadges from '../components/VerificationBadges';

describe('VerificationBadges', () => {
  it('displays verified badges', () => {
    const worker = {
      is_email_verified: true,
      is_phone_verified: true,
      is_identity_verified: false,
      is_background_checked: false,
      projects_completed: 25,
      client_rating: 4.5
    };

    render(<VerificationBadges worker={worker} size="md" />);
    
    expect(screen.getByText('Email Verified')).toBeInTheDocument();
    expect(screen.getByText('Phone Verified')).toBeInTheDocument();
    expect(screen.getByText('Verified Worker')).toBeInTheDocument();
  });
});
```

---

## Summary

The verification badges system is designed to be:
- **Easy to integrate** - Just import and use
- **Flexible** - Works with any worker data
- **Responsive** - Adapts to screen size
- **Performant** - Minimal overhead
- **Accessible** - Proper icons and labels

Start by adding `<VerificationBadges worker={worker} size="md" />` to your worker display components!
