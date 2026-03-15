import { CheckCircle, Mail, Phone, Shield, Award } from 'lucide-react';

const VerificationBadges = ({ worker, size = 'md' }) => {
  if (!worker) return null;

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'flex flex-wrap gap-1',
      badge: 'px-2 py-1 text-xs rounded-full',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'flex flex-wrap gap-2',
      badge: 'px-3 py-1.5 text-sm rounded-full',
      icon: 'w-4 h-4'
    },
    lg: {
      container: 'flex flex-wrap gap-3',
      badge: 'px-4 py-2 text-base rounded-full',
      icon: 'w-5 h-5'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Badge definitions
  const badges = [
    {
      id: 'email',
      label: 'Email Verified',
      icon: Mail,
      color: 'bg-blue-100 text-blue-700 border border-blue-300',
      isVerified: worker.is_email_verified,
      tooltip: 'Email address verified'
    },
    {
      id: 'phone',
      label: 'Phone Verified',
      icon: Phone,
      color: 'bg-green-100 text-green-700 border border-green-300',
      isVerified: worker.is_phone_verified,
      tooltip: 'Phone number verified'
    },
    {
      id: 'identity',
      label: 'Identity Verified',
      icon: Shield,
      color: 'bg-purple-100 text-purple-700 border border-purple-300',
      isVerified: worker.is_identity_verified,
      tooltip: 'Government ID verified'
    },
    {
      id: 'background',
      label: 'Background Checked',
      icon: CheckCircle,
      color: 'bg-amber-100 text-amber-700 border border-amber-300',
      isVerified: worker.is_background_checked,
      tooltip: 'Background check passed'
    },
    {
      id: 'verified_worker',
      label: 'Verified Worker',
      icon: Award,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      isVerified: worker.projects_completed >= 20 && (worker.client_rating || 0) >= 4.0
    }
  ];

  // Filter only verified badges
  const verifiedBadges = badges.filter(badge => badge.isVerified);

  if (verifiedBadges.length === 0) {
    return null;
  }

  return (
    <div className={config.container}>
      {verifiedBadges.map(badge => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className={`${config.badge} ${badge.color} rounded-full border flex items-center gap-1.5 font-semibold transition-all duration-200 hover:shadow-md`}
            title={badge.label}
          >
            <Icon className={config.icon} />
            <span className="hidden sm:inline">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default VerificationBadges;
