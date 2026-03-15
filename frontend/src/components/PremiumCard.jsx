import { useRef, useEffect } from 'react';

/**
 * Premium Card Component with Hover Light Effect
 * 
 * Features:
 * - Smooth hover lift animation
 * - Edge glow effect on hover
 * - Mouse-following light effect (radial gradient)
 * - Consistent shadow system
 * - Professional transitions
 * 
 * Usage:
 * <PremiumCard className="p-6">
 *   Your content here
 * </PremiumCard>
 */
const PremiumCard = ({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  glow = true 
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!hover || !glow) return;

    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hover, glow]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`premium-card ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
};

export default PremiumCard;
