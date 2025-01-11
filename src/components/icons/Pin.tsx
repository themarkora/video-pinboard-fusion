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
      <path d="M21.121 9.12l-6.241-6.241a1 1 0 00-1.415 0l-1.415 1.414a1 1 0 000 1.415l.707.707L9.12 9.12a3 3 0 01-4.243 0L4.93 9.072 3.515 10.485a1 1 0 000 1.415l6.241 6.241a1 1 0 001.415 0l1.414-1.414a1 1 0 000-1.415l-.707-.707 3.637-3.637a3 3 0 014.243 0l.048.048 1.414-1.414a1 1 0 000-1.415z" />
      <line x1="12" y1="15" x2="12" y2="22" />
    </svg>
  );
};