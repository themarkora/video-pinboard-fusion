import React from 'react';

interface PinOffProps {
  className?: string
  size?: number
  color?: string
}

export const PinOff: React.FC<PinOffProps> = ({ 
  className = "", 
  size = 16, 
  color = "currentColor" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="-0.5 -0.5 16 16" 
      width={size} 
      height={size} 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="m1.25 1.25 12.5 12.5" strokeWidth="1" />
      <path d="m7.5 10.625 0 3.125" strokeWidth="1" />
      <path d="M5.625 5.625v1.1a1.25 1.25 0 0 1 -0.6937500000000001 1.11875l-1.1125 0.5625A1.25 1.25 0 0 0 3.125 9.525V10.625h7.5" strokeWidth="1" />
      <path d="M9.375 5.8375V3.75h0.625a1.25 1.25 0 0 0 0 -2.5H4.9312499999999995" strokeWidth="1" />
    </svg>
  )
}