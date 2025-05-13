import React from "react";

const ZyahLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full text-primary">
        {/* Facial outline */}
        <path 
          d="M50 15 C65 15, 80 30, 80 50 C80 70, 65 85, 50 85 C35 85, 20 70, 20 50 C20 30, 35 15, 50 15"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        />
        
        {/* Face details */}
        <path d="M40 40 L40 50 L60 50 L60 40" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 40 L30 30" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M60 40 L70 30" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 50 L30 60" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M60 50 L70 60" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M45 65 L55 65" fill="none" stroke="currentColor" strokeWidth="2" />
        
        {/* Lines around the face */}
        {Array.from({ length: 15 }).map((_, i) => (
          <path 
            key={i}
            d={`M${15 + i * 5} ${35 - i * 1.5} Q${50} ${10} ${85 - i * 5} ${35 - i * 1.5}`}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            opacity={0.8}
          />
        ))}
      </svg>
    </div>
  );
};

export default ZyahLogo;
