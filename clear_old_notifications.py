"""
Clear old notifications to test fresh ones
"""
from app.database import SessionLocal
from app.models import Notification

def clear_notifications():
    db = SessionLocal()
    
    print("=" * 60)
    print("CLEAR OLD NOTIFICATIONS")
    print("=" * 60)
    
    # Count notifications
    count = db.query(Notification).count()
    print(f"\nTotal notifications: {count}")
    
    if count == 0:
        print("No notifications to clear.")
        db.close()
        return
    
    # Ask for confirmation
    response = input(f"\nDelete all {count} notifications? (yes/no): ")
    
    if response.lower() == 'yes':
        db.query(Notification).delete()
        db.commit()
        print(f"✓ Deleted {count} notifications")
    else:
        print("Cancelled.")
    
    db.close()
    
    print("\n" + "=" * 60)
    print("Now test by:")
    print("1. Worker applies to a job")
    print("2. Check notification - should show correct job trade")
    print("=" * 60)

if __name__ == "__main__":
    clear_notifications()
