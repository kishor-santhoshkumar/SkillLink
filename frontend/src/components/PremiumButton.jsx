/**
 * Premium Button Component
 * 
 * Features:
 * - Smooth hover lift
 * - Gradient background
 * - Shadow glow effect
 * - Ripple animation on click
 * - Icon support
 * 
 * Variants: primary, secondary, outline
 */
const PremiumButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'premium-button inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'premium-button-primary',
    secondary: 'bg-white text-[#1F3A5F] border-2 border-[#1F3A5F] hover:bg-[#F8FAFC]',
    outline: 'bg-transparent text-[#2563EB] border-2 border-[#2563EB] hover:bg-blue-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default PremiumButton;
