import React from 'react';

export default function SetuviaLogo({ className = "w-8 h-8", size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="Setuvia Resolution Engine Logo"
    >
      {/* Matte Obsidian Titanium Housing */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        fill="#0C0E12"
        stroke="#272A32"
        strokeWidth="1.2"
      />

      {/* Primary Architectural Upper Arc (Pure Crisp White) */}
      <path
        d="M9 13.5C9 10.46 11.46 8 14.5 8H18.5C21.54 8 24 10.46 24 13.5C24 15.6 22.8 17.4 21 18.3L15 21"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Opposing Lower Foundation Arc (High-Contrast Platinum) */}
      <path
        d="M23 18.5C23 21.54 20.54 24 17.5 24H13.5C10.46 24 8 21.54 8 18.5C8 16.4 9.2 14.6 11 13.7L17 11"
        stroke="#E2E8F0"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />

      {/* Central Resolution Core / Synapse Nexus */}
      <circle cx="16" cy="16" r="1.6" fill="#FFFFFF" />

      {/* Precision Apex Anchor Points */}
      <circle cx="9" cy="13.5" r="1.1" fill="#FFFFFF" />
      <circle cx="23" cy="18.5" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}
