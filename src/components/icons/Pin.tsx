import React from "react";

interface PinProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Pin: React.FC<PinProps> = ({ 
  className = "", 
  size = 32, 
  color = "currentColor",
  strokeWidth = 2
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="4" x2="12" y2="2" />
    </svg>
  );
};