/**
 * Maya Iconography Component
 *
 * Culturally accurate Maya-themed SVG icons for rank system.
 * Each rank has a unique icon inspired by Maya art and symbolism.
 */

import React from 'react';
import type { MayaRank } from '../types/ranksTypes';

interface MayaIconProps {
  rank: MayaRank;
  className?: string;
  size?: number;
}

/**
 * NACOM Icon - Detective Badge (Beginner)
 * Inspired by Maya circular glyphs and detective symbolism
 */
export const NacomIcon: React.FC<Omit<MayaIconProps, 'rank'>> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 6 L14 10 L12 9 L10 10 Z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

/**
 * Ajaw Icon - Señor / Gobernante
 * Inspired by Maya warrior shields and geometric patterns
 */
export const AjawIcon: React.FC<Omit<MayaIconProps, 'rank'>> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2 L20 6 L20 12 C20 17 16 20 12 22 C8 20 4 17 4 12 L4 6 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M12 6 L16 9 L16 13 C16 15 14 17 12 18 C10 17 8 15 8 13 L8 9 Z"
      fill="currentColor"
      opacity="0.3"
    />
    <rect x="10" y="10" width="4" height="6" rx="1" fill="currentColor" />
  </svg>
);

/**
 * Ah K'in Icon - Sacerdote del Sol
 * Inspired by Maya star glyphs and astronomical symbols
 */
export const AhKinIcon: React.FC<Omit<MayaIconProps, 'rank'>> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2 L14.5 9 L22 9.5 L16 14.5 L18 22 L12 17.5 L6 22 L8 14.5 L2 9.5 L9.5 9 Z"
      fill="currentColor"
    />
    <path
      d="M12 6 L13 10 L17 10.5 L14 13 L15 17 L12 14.5 L9 17 L10 13 L7 10.5 L11 10 Z"
      fill="currentColor"
      opacity="0.5"
    />
    <circle cx="12" cy="12" r="2" fill="white" opacity="0.8" />
  </svg>
);

/**
 * Halach Uinic Icon - Hombre Verdadero
 * Inspired by Maya warrior glyphs and ceremonial medallions
 */
export const HalachUinicIcon: React.FC<Omit<MayaIconProps, 'rank'>> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="14" r="8" fill="currentColor" />
    <circle cx="12" cy="14" r="6" fill="currentColor" opacity="0.7" />
    <path
      d="M8 2 L10 8 L12 2 L14 8 L16 2 L14 8 L12 10 L10 8 Z"
      fill="currentColor"
    />
    <path
      d="M12 10 L16 12 L14 16 L12 18 L10 16 L8 12 Z"
      fill="white"
      opacity="0.3"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="white"
      fontSize="8"
      fontWeight="bold"
    >
      C
    </text>
  </svg>
);

/**
 * K'uk'ulkan Icon - Serpiente Emplumada
 * Inspired by Maya royal crowns and divine symbols
 */
export const KukulkanIcon: React.FC<Omit<MayaIconProps, 'rank'>> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 18 L3 12 L6 14 L9 10 L12 13 L15 10 L18 14 L21 12 L21 18 Z"
      fill="currentColor"
    />
    <circle cx="6" cy="10" r="2" fill="currentColor" />
    <circle cx="12" cy="8" r="2.5" fill="currentColor" />
    <circle cx="18" cy="10" r="2" fill="currentColor" />
    <path
      d="M5 18 L19 18 L19 20 L5 20 Z"
      fill="currentColor"
      opacity="0.8"
    />
    <circle cx="12" cy="8" r="1" fill="white" opacity="0.8" />
  </svg>
);

/**
 * Prestige Star Icon
 * Special icon for prestige levels
 */
export const PrestigeStarIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 1 L9.5 5.5 L14 6 L10.5 9 L11.5 13.5 L8 11 L4.5 13.5 L5.5 9 L2 6 L6.5 5.5 Z"
      fill="currentColor"
    />
    <path
      d="M8 3 L9 6 L12 6.5 L10 8.5 L10.5 11.5 L8 10 L5.5 11.5 L6 8.5 L4 6.5 L7 6 Z"
      fill="white"
      opacity="0.5"
    />
  </svg>
);

/**
 * Main Maya Icon Component
 * Renders the appropriate icon based on rank
 */
export const MayaIcon: React.FC<MayaIconProps> = ({ rank, className, size = 24 }) => {
  switch (rank) {
    case 'Nacom':
      return <NacomIcon className={className} size={size} />;
    case 'Ajaw':
      return <AjawIcon className={className} size={size} />;
    case 'Ah K\'in':
      return <AhKinIcon className={className} size={size} />;
    case 'Halach Uinic':
      return <HalachUinicIcon className={className} size={size} />;
    case 'K\'uk\'ulkan':
      return <KukulkanIcon className={className} size={size} />;
    default:
      return <NacomIcon className={className} size={size} />;
  }
};

/**
 * Get icon component by rank (for dynamic usage)
 */
export function getMayaIconComponent(rank: MayaRank) {
  switch (rank) {
    case 'Nacom':
      return NacomIcon;
    case 'Ajaw':
      return AjawIcon;
    case 'Ah K\'in':
      return AhKinIcon;
    case 'Halach Uinic':
      return HalachUinicIcon;
    case 'K\'uk\'ulkan':
      return KukulkanIcon;
    default:
      return NacomIcon;
  }
}
