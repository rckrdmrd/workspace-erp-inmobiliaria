/**
 * Vibrant Color Palette Utility
 *
 * Provides consistent, colorful gradients for cards and components
 * Based on MissionCard color scheme but with more variety
 */

export interface ColorScheme {
  // Gradients for icons/backgrounds
  iconGradient: string;
  progressGradient: string;
  buttonGradient: string;
  buttonHoverGradient: string;

  // Borders and shadows
  border: string;
  shadow: string;
  background: string;

  // Badge colors
  badge: string;

  // Individual colors
  primary: string;
  secondary: string;
  light: string;
}

// Vibrant color palette (8 schemes)
const colorPalette: ColorScheme[] = [
  // 1. Blue-Cyan (Ocean)
  {
    iconGradient: 'from-blue-500 to-cyan-500',
    progressGradient: 'from-blue-500 to-cyan-500',
    buttonGradient: 'from-blue-500 to-cyan-500',
    buttonHoverGradient: 'from-blue-600 to-cyan-600',
    border: 'border-blue-400',
    shadow: 'shadow-blue-200',
    background: 'bg-blue-50',
    badge: 'bg-blue-500 text-white',
    primary: 'blue-500',
    secondary: 'cyan-500',
    light: 'blue-50',
  },

  // 2. Orange-Amber (Sunset)
  {
    iconGradient: 'from-orange-500 to-amber-500',
    progressGradient: 'from-orange-500 to-amber-500',
    buttonGradient: 'from-orange-500 to-amber-500',
    buttonHoverGradient: 'from-orange-600 to-amber-600',
    border: 'border-orange-400',
    shadow: 'shadow-orange-200',
    background: 'bg-orange-50',
    badge: 'bg-orange-500 text-white',
    primary: 'orange-500',
    secondary: 'amber-500',
    light: 'orange-50',
  },

  // 3. Purple-Pink (Twilight)
  {
    iconGradient: 'from-purple-500 to-pink-500',
    progressGradient: 'from-purple-500 to-pink-500',
    buttonGradient: 'from-purple-500 to-pink-500',
    buttonHoverGradient: 'from-purple-600 to-pink-600',
    border: 'border-purple-400',
    shadow: 'shadow-purple-200',
    background: 'bg-purple-50',
    badge: 'bg-purple-500 text-white',
    primary: 'purple-500',
    secondary: 'pink-500',
    light: 'purple-50',
  },

  // 4. Green-Emerald (Forest)
  {
    iconGradient: 'from-green-500 to-emerald-500',
    progressGradient: 'from-green-500 to-emerald-500',
    buttonGradient: 'from-green-500 to-emerald-500',
    buttonHoverGradient: 'from-green-600 to-emerald-600',
    border: 'border-green-400',
    shadow: 'shadow-green-200',
    background: 'bg-green-50',
    badge: 'bg-green-500 text-white',
    primary: 'green-500',
    secondary: 'emerald-500',
    light: 'green-50',
  },

  // 5. Red-Rose (Fire)
  {
    iconGradient: 'from-red-500 to-rose-500',
    progressGradient: 'from-red-500 to-rose-500',
    buttonGradient: 'from-red-500 to-rose-500',
    buttonHoverGradient: 'from-red-600 to-rose-600',
    border: 'border-red-400',
    shadow: 'shadow-red-200',
    background: 'bg-red-50',
    badge: 'bg-red-500 text-white',
    primary: 'red-500',
    secondary: 'rose-500',
    light: 'red-50',
  },

  // 6. Indigo-Blue (Night Sky)
  {
    iconGradient: 'from-indigo-500 to-blue-500',
    progressGradient: 'from-indigo-500 to-blue-500',
    buttonGradient: 'from-indigo-500 to-blue-500',
    buttonHoverGradient: 'from-indigo-600 to-blue-600',
    border: 'border-indigo-400',
    shadow: 'shadow-indigo-200',
    background: 'bg-indigo-50',
    badge: 'bg-indigo-500 text-white',
    primary: 'indigo-500',
    secondary: 'blue-500',
    light: 'indigo-50',
  },

  // 7. Teal-Cyan (Tropical)
  {
    iconGradient: 'from-teal-500 to-cyan-500',
    progressGradient: 'from-teal-500 to-cyan-500',
    buttonGradient: 'from-teal-500 to-cyan-500',
    buttonHoverGradient: 'from-teal-600 to-cyan-600',
    border: 'border-teal-400',
    shadow: 'shadow-teal-200',
    background: 'bg-teal-50',
    badge: 'bg-teal-500 text-white',
    primary: 'teal-500',
    secondary: 'cyan-500',
    light: 'teal-50',
  },

  // 8. Fuchsia-Purple (Neon)
  {
    iconGradient: 'from-fuchsia-500 to-purple-500',
    progressGradient: 'from-fuchsia-500 to-purple-500',
    buttonGradient: 'from-fuchsia-500 to-purple-500',
    buttonHoverGradient: 'from-fuchsia-600 to-purple-600',
    border: 'border-fuchsia-400',
    shadow: 'shadow-fuchsia-200',
    background: 'bg-fuchsia-50',
    badge: 'bg-fuchsia-500 text-white',
    primary: 'fuchsia-500',
    secondary: 'purple-500',
    light: 'fuchsia-50',
  },
];

/**
 * Get a random color scheme from the palette
 */
export function getRandomColorScheme(): ColorScheme {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
}

/**
 * Get a color scheme by index (for consistent coloring)
 * Useful when you want deterministic colors based on item index
 */
export function getColorSchemeByIndex(index: number): ColorScheme {
  return colorPalette[index % colorPalette.length];
}

/**
 * Get a color scheme by ID (for consistent coloring based on string ID)
 * Uses simple hash function to convert string to index
 */
export function getColorSchemeById(id: string): ColorScheme {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

/**
 * Get all available color schemes
 */
export function getAllColorSchemes(): ColorScheme[] {
  return [...colorPalette];
}

/**
 * Get a specific color scheme by name
 */
export function getColorSchemeByName(name: string): ColorScheme {
  const nameMap: Record<string, number> = {
    ocean: 0,
    sunset: 1,
    twilight: 2,
    forest: 3,
    fire: 4,
    'night-sky': 5,
    tropical: 6,
    neon: 7,
  };

  const index = nameMap[name.toLowerCase()] ?? 0;
  return colorPalette[index];
}
