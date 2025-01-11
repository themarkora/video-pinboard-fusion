import React from 'react';

interface PinProps {
  className?: string
  size?: number
  color?: string
}

export const Pin: React.FC<PinProps> = ({ 
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
      <path d="m7.5 10.625 0 3.125" strokeWidth="1" />
      <path d="M3.125 10.625h8.75v-1.1a1.25 1.25 0 0 0 -0.6937500000000001 -1.11875l-1.1125 -0.5625A1.25 1.25 0 0 1 9.375 6.725V3.75h0.625a1.25 1.25 0 0 0 0 -2.5H5a1.25 1.25 0 0 0 0 2.5h0.625v2.9749999999999996a1.25 1.25 0 0 1 -0.6937500000000001 1.11875l-1.1125 0.5625A1.25 1.25 0 0 0 3.125 9.525Z" strokeWidth="1" />
    </svg>
  )
}