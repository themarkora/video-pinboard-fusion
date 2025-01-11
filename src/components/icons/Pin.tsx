import React from 'react';

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
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
    >
      <path d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 7.58172 18 12 18C16.4183 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2ZM12 15C9.23858 15 7 12.7614 7 10C7 7.23858 9.23858 5 12 5C14.7614 5 17 7.23858 17 10C17 12.7614 14.7614 15 12 15Z"/>
      <path d="M12 18V22"/>
    </svg>
  );
};