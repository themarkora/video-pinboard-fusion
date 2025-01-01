import { useEffect, useState } from "react";

const Pin = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute w-8 h-8 opacity-5 animate-float-pin"
    style={style}
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 4.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 6.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"/>
    </svg>
  </div>
);

export const AnimatedBackground = () => {
  const [pins, setPins] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newPins = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
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