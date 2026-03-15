import React from 'react';
import { Clock, Eye, CheckCircle, XCircle } from 'lucide-react';

const ApplicationStatus = ({ status }) => {
  const statusConfig = {
    pending: {
      emoji: '🟡',
      icon: Clock,
      label: 'Pending',
      className: 'status-pending',
      description: 'Application submitted'
    },
    review: {
      emoji: '🔵',
      icon: Eye,
      label: 'Under Review',
      className: 'status-review',
      description: 'Company is reviewing'
    },
    accepted: {
      emoji: '🟢',
      icon: CheckCircle,
      label: 'Accepted',
      className: 'status-accepted',
      description: 'You got the job!'
    },
    rejected: {
      emoji: '🔴',
      icon: XCircle,
      label: 'Rejected',
      className: 'status-rejected',
      description: 'Not selected this time'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Emoji + Icon */}
      <div className={`${config.className} text-lg`}>
        <span className="text-2xl mr-2">{config.emoji}</span>
        <Icon className="w-5 h-5 inline" />
        <span className="ml-2">{config.label}</span>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 text-center">
        {config.description}
      </p>
    </div>
  );
};

export default ApplicationStatus;
