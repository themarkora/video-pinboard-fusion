import { useEffect, useState } from "react";

const Pin = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute w-8 h-8 opacity-[0.08] animate-float-pin text-white"
    style={style}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="-0.5 -0.5 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="m7.5 10.625 0 3.125" strokeWidth={1} />
      <path d="M3.125 10.625h8.75v-1.1a1.25 1.25 0 0 0 -0.6937500000000001 -1.11875l-1.1125 -0.5625A1.25 1.25 0 0 1 9.375 6.725V3.75h0.625a1.25 1.25 0 0 0 0 -2.5H5a1.25 1.25 0 0 0 0 2.5h0.625v2.9749999999999996a1.25 1.25 0 0 1 -0.6937500000000001 1.11875l-1.1125 0.5625A1.25 1.25 0 0 0 3.125 9.525Z" strokeWidth={1} />
    </svg>
  </div>
);

export const AnimatedBackground = () => {
  const [pins, setPins] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Create fewer pins for a more elegant look
    const newPins = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${8 + Math.random() * 4}s`, // Slower animation for smoother movement
    }));
    setPins(newPins);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {pins.map((style, index) => (
        <Pin key={index} style={style} />
      ))}
    </div>
  );
};