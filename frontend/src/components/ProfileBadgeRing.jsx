import { Award, CheckCircle, Shield, Phone, Mail } from 'lucide-react';

const ProfileBadgeRing = ({ worker, size = 'md', demo = false }) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-24 h-24',
      badge: 'w-6 h-6',
      icon: 'w-3 h-3',
      offset: 'translate-x-10 -translate-y-2',
    },
    md: {
      container: 'w-32 h-32',
      badge: 'w-8 h-8',
      icon: 'w-4 h-4',
      offset: 'translate-x-14 -translate-y-3',
    },
    lg: {
      container: 'w-40 h-40',
      badge: 'w-10 h-10',
      icon: 'w-5 h-5',
      offset: 'translate-x-16 -translate-y-4',
    },
  };

  const config = sizeConfig[size];

  // Determine which badges to show based on verification status
  const badges = [];

  // Demo mode - show all badges for testing
  if (demo) {
    badges.push({
      id: 'email',
      icon: Mail,
      color: 'bg-blue-500',
      title: 'Email Verified',
    });
    badges.push({
      id: 'phone',
      icon: Phone,
      color: 'bg-green-500',
      title: 'Phone Verified',
    });
    badges.push({
      id: 'identity',
      icon: Shield,
      color: 'bg-purple-500',
      title: 'Identity Verified',
    });
    badges.push({
      id: 'verified',
      icon: CheckCircle,
      color: 'bg-green-600',
      title: 'Verified Worker',
    });
  } else {
    // Production mode - check actual verification fields
    if (worker?.is_email_verified) {
      badges.push({
        id: 'email',
        icon: Mail,
        color: 'bg-blue-500',
        title: 'Email Verified',
      });
    }

    if (worker?.is_phone_verified) {
      badges.push({
        id: 'phone',
        icon: Phone,
        color: 'bg-green-500',
        title: 'Phone Verified',
      });
    }

    if (worker?.is_identity_verified) {
      badges.push({
        id: 'identity',
        icon: Shield,
        color: 'bg-purple-500',
        title: 'Identity Verified',
      });
    }

    if (worker?.projects_completed >= 20 && worker?.client_rating >= 4.0) {
      badges.push({
        id: 'verified',
        icon: CheckCircle,
        color: 'bg-green-600',
        title: 'Verified Worker',
      });
    }

    if (worker?.is_background_checked) {
      badges.push({
        id: 'background',
        icon: Award,
        color: 'bg-amber-500',
        title: 'Background Verified',
      });
    }
  }

  // If no badges, return just the container
  if (badges.length === 0) {
    return null;
  }

  // Calculate badge positions around the circle (in degrees)
  const angleStep = 360 / badges.length;

  return (
    <div className="relative inline-block">
      {/* Badge Ring Container */}
      <div className={`${config.container} relative`}>
        {/* Animated ring border */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-border animate-spin-slow opacity-30"></div>

        {/* Badges positioned around the circle */}
        {badges.map((badge, index) => {
          const angle = (angleStep * index - 90) * (Math.PI / 180);
          const radius = size === 'sm' ? 45 : size === 'md' ? 65 : 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const BadgeIcon = badge.icon;

          return (
            <div
              key={badge.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              title={badge.title}
            >
              <div
                className={`${config.badge} ${badge.color} rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform duration-300 cursor-pointer`}
              >
                <BadgeIcon className={`${config.icon} text-white`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileBadgeRing;
