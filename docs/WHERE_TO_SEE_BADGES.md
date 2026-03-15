# Where to See Worker Verification Badges

## 🎯 Current Locations

### 1. **Search Workers Page** (Company Dashboard)
**Path**: `/company/search-workers`

This is the main place to see verification badges on worker cards.

**How to access:**
1. Login as a company
2. Go to "Search Workers" or "Find Workers"
3. Browse the worker grid
4. Each worker card shows verification badges below their details

**What you'll see:**
```
┌─────────────────────────────────┐
│ [Worker Photo]                  │
│ John Smith - Carpenter          │
│ ⭐⭐⭐⭐⭐ 4.8                   │
│ 📍 New York, NY                 │
│ 💼 5 years experience           │
│ 🏆 120 projects completed       │
│                                 │
│ ✉️ Email  ☎️ Phone  🛡️ Identity│  ← BADGES HERE
│                                 │
│ [View Profile] [Call]           │
└─────────────────────────────────┘
```

---

### 2. **Worker Detail Page** (Full Profile)
**Path**: `/worker/{worker_id}`

Click "View Profile" on any worker card to see the full profile with badges.

**What you'll see:**
- Worker photo and basic info
- Verification badges prominently displayed
- Full work history and specializations
- Reviews and ratings
- Contact information

---

### 3. **My Workers Page** (Company Dashboard)
**Path**: `/company/my-workers`

See verification status of workers you've hired.

**What you'll see:**
- List of workers you've hired
- Their verification status
- Job completion status
- Ratings you've given them

---

## 🔧 How to Enable Badges for Workers

### Step 1: Verify a Worker (Admin/Company)

Use the API to verify a worker:

```bash
# Verify email
curl -X PATCH http://127.0.0.1:8000/verification/workers/1/email \
  -H "Authorization: Bearer {your_token}"

# Verify phone
curl -X PATCH http://127.0.0.1:8000/verification/workers/1/phone \
  -H "Authorization: Bearer {your_token}"

# Verify identity
curl -X PATCH http://127.0.0.1:8000/verification/workers/1/identity \
  -H "Authorization: Bearer {your_token}"

# Verify background
curl -X PATCH http://127.0.0.1:8000/verification/workers/1/background \
  -H "Authorization: Bearer {your_token}"
```

### Step 2: Check Badges

```bash
# Get all badges for a worker
curl http://127.0.0.1:8000/verification/workers/1/badges
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

---

## 📊 Badge Types & Requirements

| Badge | Icon | Color | Requirement |
|-------|------|-------|-------------|
| Email Verified | ✉️ | Blue | Email confirmed |
| Phone Verified | ☎️ | Green | Phone confirmed |
| Identity Verified | 🛡️ | Purple | Government ID verified |
| Background Checked | ✓ | Amber | Background check passed |
| Verified Worker | ⭐ | Yellow | 20+ projects & 4.0+ rating |

---

## 🚀 Quick Test

### Test with Python Script

```python
import requests

# Get a worker
response = requests.get('http://127.0.0.1:8000/workers/')
workers = response.json()

if workers:
    worker_id = workers[0]['id']
    
    # Get their badges
    badges_response = requests.get(
        f'http://127.0.0.1:8000/verification/workers/{worker_id}/badges'
    )
    print(badges_response.json())
```

### Test with Browser

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:

```javascript
fetch('http://127.0.0.1:8000/workers/')
  .then(r => r.json())
  .then(workers => {
    if (workers.length > 0) {
      return fetch(`http://127.0.0.1:8000/verification/workers/${workers[0].id}/badges`);
    }
  })
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 🎨 Badge Display Sizes

Badges appear in different sizes depending on context:

### Small (sm) - Grid View
```
✉️ Email  ☎️ Phone  🛡️ Identity
```

### Medium (md) - Detail View
```
✉️ Email Verified  ☎️ Phone Verified  🛡️ Identity Verified
```

### Large (lg) - Admin Interface
```
✉️  Email Verified  ☎️  Phone Verified  🛡️  Identity Verified
```

---

## 🔐 Admin Management Interface

To manage verifications, use the **VerificationManager** component:

```jsx
import VerificationManager from './components/VerificationManager';

<VerificationManager workerId={123} onUpdate={handleUpdate} />
```

This shows:
- All verification statuses
- Verify/Revoke buttons
- Loading states
- Error handling

---

## 📱 Mobile View

On mobile devices:
- Badges stack vertically
- Icons are smaller
- Labels are hidden (only icons show)
- Touch-friendly buttons

---

## 🧪 Test Scenarios

### Scenario 1: View Worker with All Badges
1. Login as company
2. Go to Search Workers
3. Find a worker with 20+ projects and 4.0+ rating
4. See all 5 badges displayed

### Scenario 2: View Worker with Some Badges
1. Find a worker with email and phone verified
2. See only those 2 badges displayed
3. Other badges are hidden

### Scenario 3: View Worker with No Badges
1. Find a new worker
2. No badges are displayed
3. Worker card still shows normally

### Scenario 4: Verify a Worker
1. Get worker ID
2. Use API to verify email
3. Refresh page
4. See email badge appear

---

## 🐛 Troubleshooting

### Badges Not Showing?

**Check 1: Worker has verified badges**
```bash
curl http://127.0.0.1:8000/verification/workers/1/badges
```

**Check 2: Database fields exist**
```sql
SELECT is_email_verified, is_phone_verified, is_identity_verified, 
       is_background_checked FROM resumes LIMIT 1;
```

**Check 3: Component is imported**
- Verify `VerificationBadges` is imported in WorkerCard
- Check browser console for errors

**Check 4: Worker data is loaded**
- Open DevTools
- Check Network tab
- Verify worker data includes verification fields

### Badges Showing But Empty?

- Worker has no verified badges
- This is normal - only verified badges display
- Verify a worker to see badges appear

### Styling Issues?

- Check CSS is loaded: `frontend/src/index.css`
- Verify Tailwind is working
- Check browser console for CSS errors

---

## 📚 Related Documentation

- **VERIFICATION_BADGES_GUIDE.md** - Complete feature guide
- **VERIFICATION_INTEGRATION_EXAMPLES.md** - Code examples
- **VERIFICATION_QUICK_START.md** - Quick setup
- **VERIFICATION_VISUAL_REFERENCE.txt** - Design reference

---

## 🎯 Next Steps

1. **View badges** on Search Workers page
2. **Verify a worker** using the API
3. **See badges appear** on worker cards
4. **Integrate** VerificationManager into admin dashboard
5. **Customize** badge display as needed

---

**Ready to see badges in action?**

1. Login as company
2. Go to Search Workers
3. Look for badges on worker cards
4. Click View Profile to see more details

Enjoy! 🎉
