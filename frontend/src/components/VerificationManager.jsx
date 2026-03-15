import { useState, useEffect } from 'react';
import { CheckCircle, Mail, Phone, Shield, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const VerificationManager = ({ workerId, onUpdate }) => {
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, [workerId]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/verification/workers/${workerId}/badges`
      );
      setBadges(response.data.badges);
      setError(null);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to load verification badges');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (badgeType) => {
    try {
      setUpdating(badgeType);
      const token = localStorage.getItem('token');
      
      await axios.patch(
        `http://127.0.0.1:8000/verification/workers/${workerId}/${badgeType}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setBadges(prev => ({
        ...prev,
        [badgeType]: true
      }));
      
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(`Error verifying ${badgeType}:`, err);
      setError(`Failed to verify ${badgeType}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleRevoke = async (badgeType) => {
    if (!confirm(`Revoke ${badgeType} verification?`)) return;
    
    try {
      setUpdating(badgeType);
      const token = localStorage.getItem('token');
      
      await axios.patch(
        `http://127.0.0.1:8000/verification/workers/${workerId}/revoke/${badgeType}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setBadges(prev => ({
        ...prev,
        [badgeType]: false
      }));
      
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(`Error revoking ${badgeType}:`, err);
      setError(`Failed to revoke ${badgeType}`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!badges) return null;

  const badgeConfig = [
    {
      key: 'email_verified',
      label: 'Email Verified',
      icon: Mail,
      color: 'blue'
    },
    {
      key: 'phone_verified',
      label: 'Phone Verified',
      icon: Phone,
      color: 'green'
    },
    {
      key: 'identity_verified',
      label: 'Identity Verified',
      icon: Shield,
      color: 'purple'
    },
    {
      key: 'background_checked',
      label: 'Background Checked',
      icon: CheckCircle,
      color: 'amber'
    }
  ];

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700'
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {badgeConfig.map(badge => {
          const Icon = badge.icon;
          const isVerified = badges[badge.key];
          
          return (
            <div
              key={badge.key}
              className={`p-4 border rounded-lg ${colorMap[badge.color]} transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{badge.label}</span>
                </div>
                
                {isVerified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <button
                      onClick={() => handleRevoke(badge.key.replace('_verified', '').replace('_checked', ''))}
                      disabled={updating === badge.key}
                      className="text-sm px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      {updating === badge.key ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerify(badge.key.replace('_verified', '').replace('_checked', ''))}
                    disabled={updating === badge.key}
                    className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating === badge.key ? 'Verifying...' : 'Verify'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationManager;
