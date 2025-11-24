/**
 * Shop Items Mock Data - 50+ Items Across 5 Categories
 *
 * Comprehensive mock data for the GLIT Platform ML Coins Shop
 * Categories: Cosmetics, Profile, Guild, Premium, Social
 */

import type { ShopItem } from '../types/economyTypes';

/**
 * COSMETICS SHOP (50-500 ML)
 * Avatar items, theme packs, visual effects, seasonal items
 */
const cosmeticsItems: ShopItem[] = [
  {
    id: 'cosmetic_001',
    name: 'Detective Hat',
    description: 'Classic detective fedora. Look sharp while solving mysteries!',
    category: 'cosmetics',
    price: 75,
    icon: '🎩',
    rarity: 'common',
    tags: ['avatar', 'hat', 'classic'],
    isOwned: false,
    isPurchasable: true,
    metadata: {
      effectDescription: 'Adds detective hat to your avatar',
      stackable: false,
      tradeable: true,
    },
  },
  {
    id: 'cosmetic_002',
    name: 'Magnifying Glass Accessory',
    description: 'Essential tool for any detective. Examine clues in style.',
    category: 'cosmetics',
    price: 50,
    icon: '🔍',
    rarity: 'common',
    tags: ['avatar', 'accessory', 'detective'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_003',
    name: 'Laboratory Coat',
    description: 'Marie Curie-inspired lab coat for scientific excellence.',
    category: 'cosmetics',
    price: 150,
    icon: '🥼',
    rarity: 'rare',
    tags: ['avatar', 'clothing', 'science'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_004',
    name: 'Marie Curie Portrait Frame',
    description: 'Elegant portrait frame featuring Marie Curie.',
    category: 'cosmetics',
    price: 200,
    icon: '🖼️',
    rarity: 'rare',
    tags: ['avatar', 'frame', 'historical'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_005',
    name: 'Radioactive Aura Effect',
    description: 'Glow with scientific brilliance! Animated aura effect.',
    category: 'cosmetics',
    price: 300,
    icon: '✨',
    rarity: 'epic',
    tags: ['effect', 'aura', 'animated'],
    isOwned: false,
    isPurchasable: true,
    metadata: {
      effectDescription: 'Adds glowing radioactive aura to avatar',
      stackable: false,
      tradeable: false,
    },
  },
  {
    id: 'cosmetic_006',
    name: 'Nobel Prize Medal',
    description: 'Legendary medal for top detectives. Ultra rare!',
    category: 'cosmetics',
    price: 500,
    icon: '🏅',
    rarity: 'legendary',
    tags: ['medal', 'achievement', 'prestigious'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      rank: 'Halach Uinic',
      level: 10,
    },
  },
  {
    id: 'cosmetic_007',
    name: 'Mystery Book Badge',
    description: 'Badge showing you are a master of literary mysteries.',
    category: 'cosmetics',
    price: 80,
    icon: '📚',
    rarity: 'common',
    tags: ['badge', 'literature', 'detective'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_008',
    name: 'Sherlock Holmes Pipe',
    description: 'Iconic pipe accessory for contemplative detectives.',
    category: 'cosmetics',
    price: 120,
    icon: '🔬',
    rarity: 'rare',
    tags: ['accessory', 'classic', 'detective'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_009',
    name: 'Chemistry Beaker Trail',
    description: 'Leave a trail of bubbling beakers behind you!',
    category: 'cosmetics',
    price: 250,
    icon: '⚗️',
    rarity: 'epic',
    tags: ['trail', 'effect', 'science'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_010',
    name: 'Detective Monocle',
    description: 'See the world through a detective lens.',
    category: 'cosmetics',
    price: 90,
    icon: '🧐',
    rarity: 'common',
    tags: ['accessory', 'glasses', 'detective'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_011',
    name: 'Vintage Typewriter',
    description: 'Classic writer accessory for documenting your adventures.',
    category: 'cosmetics',
    price: 180,
    icon: '⌨️',
    rarity: 'rare',
    tags: ['accessory', 'vintage', 'writer'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_012',
    name: 'Golden Scroll',
    description: 'Legendary scroll of knowledge. Extremely rare!',
    category: 'cosmetics',
    price: 450,
    icon: '📜',
    rarity: 'legendary',
    tags: ['accessory', 'knowledge', 'prestigious'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      achievement: 'master_detective',
    },
  },
  {
    id: 'cosmetic_013',
    name: 'Sparkle Effect',
    description: 'Add sparkles to your every move!',
    category: 'cosmetics',
    price: 200,
    icon: '💫',
    rarity: 'epic',
    tags: ['effect', 'animated', 'sparkle'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_014',
    name: 'Detective Badge',
    description: 'Official GLIT detective identification badge.',
    category: 'cosmetics',
    price: 60,
    icon: '🔰',
    rarity: 'common',
    tags: ['badge', 'official', 'detective'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'cosmetic_015',
    name: 'Winter Theme Pack',
    description: 'Seasonal winter decorations and effects.',
    category: 'cosmetics',
    price: 350,
    icon: '❄️',
    rarity: 'epic',
    tags: ['theme', 'seasonal', 'winter'],
    isOwned: false,
    isPurchasable: true,
  },
];

/**
 * PROFILE CUSTOMIZATION (25-200 ML)
 * Backgrounds, badges, titles, bio decorations
 */
const profileItems: ShopItem[] = [
  {
    id: 'profile_001',
    name: 'Laboratory Background',
    description: 'Marie Curie laboratory-themed profile background.',
    category: 'profile',
    price: 50,
    icon: '🔬',
    rarity: 'common',
    tags: ['background', 'science', 'laboratory'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_002',
    name: 'Science Theme Pack',
    description: 'Complete science-themed profile customization.',
    category: 'profile',
    price: 100,
    icon: '⚛️',
    rarity: 'rare',
    tags: ['theme', 'science', 'bundle'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_003',
    name: '"Master Detective" Title',
    description: 'Display this prestigious title on your profile.',
    category: 'profile',
    price: 150,
    icon: '👑',
    rarity: 'epic',
    tags: ['title', 'prestige', 'detective'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      level: 5,
    },
  },
  {
    id: 'profile_004',
    name: 'Custom Badge Designer',
    description: 'Create your own custom profile badges.',
    category: 'profile',
    price: 200,
    icon: '🎨',
    rarity: 'epic',
    tags: ['customization', 'badge', 'creator'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_005',
    name: 'Bookshelf Background',
    description: 'Classic literature-filled bookshelf background.',
    category: 'profile',
    price: 75,
    icon: '📚',
    rarity: 'common',
    tags: ['background', 'literature', 'classic'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_006',
    name: 'Starry Night Theme',
    description: 'Beautiful starry night profile theme.',
    category: 'profile',
    price: 120,
    icon: '🌌',
    rarity: 'rare',
    tags: ['theme', 'night', 'artistic'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_007',
    name: '"Literary Scholar" Title',
    description: 'Show your mastery of literature.',
    category: 'profile',
    price: 130,
    icon: '📖',
    rarity: 'rare',
    tags: ['title', 'literature', 'scholar'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_008',
    name: 'Bio Decoration Pack',
    description: 'Decorative elements for your profile bio.',
    category: 'profile',
    price: 60,
    icon: '✏️',
    rarity: 'common',
    tags: ['decoration', 'bio', 'customization'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_009',
    name: 'Animated Border',
    description: 'Glowing animated border for your profile.',
    category: 'profile',
    price: 180,
    icon: '🔲',
    rarity: 'epic',
    tags: ['border', 'animated', 'effect'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'profile_010',
    name: 'Achievement Showcase',
    description: 'Special section to highlight your top achievements.',
    category: 'profile',
    price: 90,
    icon: '🏆',
    rarity: 'rare',
    tags: ['achievement', 'showcase', 'display'],
    isOwned: false,
    isPurchasable: true,
  },
];

/**
 * GUILD FEATURES (100-300 ML)
 * Guild perks, banners, emotes, boosts
 */
const guildItems: ShopItem[] = [
  {
    id: 'guild_001',
    name: 'Guild Banner Template',
    description: 'Create custom banners for your guild.',
    category: 'guild',
    price: 100,
    icon: '🏴',
    rarity: 'common',
    tags: ['banner', 'customization', 'guild'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
  },
  {
    id: 'guild_002',
    name: 'Guild Chat Boost',
    description: 'Unlock advanced chat features for your guild.',
    category: 'guild',
    price: 150,
    icon: '💬',
    rarity: 'rare',
    tags: ['chat', 'boost', 'communication'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
    metadata: {
      duration: 30,
      effectDescription: '30 days of enhanced guild chat',
    },
  },
  {
    id: 'guild_003',
    name: 'Custom Guild Emblem',
    description: 'Design a unique emblem for your guild.',
    category: 'guild',
    price: 200,
    icon: '⚜️',
    rarity: 'epic',
    tags: ['emblem', 'customization', 'guild'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
  },
  {
    id: 'guild_004',
    name: 'Guild XP Multiplier',
    description: '+20% XP for all guild members for 7 days.',
    category: 'guild',
    price: 300,
    icon: '⚡',
    rarity: 'epic',
    tags: ['boost', 'xp', 'multiplier'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
    metadata: {
      duration: 7,
      effectDescription: '+20% XP boost for 7 days',
    },
  },
  {
    id: 'guild_005',
    name: 'Guild Emote Pack',
    description: 'Exclusive emotes for guild chat.',
    category: 'guild',
    price: 120,
    icon: '😀',
    rarity: 'rare',
    tags: ['emote', 'chat', 'social'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
  },
  {
    id: 'guild_006',
    name: 'Guild Hall Decoration',
    description: 'Decorative items for your guild hall.',
    category: 'guild',
    price: 180,
    icon: '🏛️',
    rarity: 'rare',
    tags: ['decoration', 'hall', 'guild'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
  },
  {
    id: 'guild_007',
    name: 'Guild Challenge Boost',
    description: 'Unlock special guild challenges.',
    category: 'guild',
    price: 250,
    icon: '🎯',
    rarity: 'epic',
    tags: ['challenge', 'boost', 'activity'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
      rank: 'Ajaw',
    },
  },
  {
    id: 'guild_008',
    name: 'Guild Coin Multiplier',
    description: '+10% ML Coins for guild activities for 14 days.',
    category: 'guild',
    price: 280,
    icon: '💰',
    rarity: 'epic',
    tags: ['boost', 'coins', 'multiplier'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      guildMember: true,
    },
    metadata: {
      duration: 14,
      effectDescription: '+10% ML Coins from guild activities',
    },
  },
];

/**
 * PREMIUM CONTENT (200+ ML)
 * Exclusive exercises, advanced materials, expert tutorials
 */
const premiumItems: ShopItem[] = [
  {
    id: 'premium_001',
    name: 'Advanced Physics Module',
    description: 'Exclusive advanced physics exercises and materials.',
    category: 'premium',
    price: 250,
    icon: '🔭',
    rarity: 'epic',
    tags: ['physics', 'advanced', 'education'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      level: 5,
    },
  },
  {
    id: 'premium_002',
    name: 'Expert Chemistry Tutorials',
    description: 'In-depth chemistry lessons from experts.',
    category: 'premium',
    price: 300,
    icon: '⚗️',
    rarity: 'epic',
    tags: ['chemistry', 'tutorial', 'expert'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'premium_003',
    name: 'Bonus Marie Curie Biography',
    description: 'Exclusive biographical content about Marie Curie.',
    category: 'premium',
    price: 200,
    icon: '📕',
    rarity: 'rare',
    tags: ['biography', 'history', 'exclusive'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'premium_004',
    name: 'Advanced Literature Analysis',
    description: 'Deep-dive literary analysis exercises.',
    category: 'premium',
    price: 280,
    icon: '📚',
    rarity: 'epic',
    tags: ['literature', 'analysis', 'advanced'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      level: 7,
    },
  },
  {
    id: 'premium_005',
    name: 'Scientific Method Masterclass',
    description: 'Comprehensive scientific method training.',
    category: 'premium',
    price: 350,
    icon: '🔬',
    rarity: 'legendary',
    tags: ['science', 'method', 'masterclass'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      rank: "Ah K'in",
    },
  },
  {
    id: 'premium_006',
    name: 'Critical Thinking Workshop',
    description: 'Advanced critical thinking exercises.',
    category: 'premium',
    price: 320,
    icon: '🧠',
    rarity: 'epic',
    tags: ['thinking', 'workshop', 'skills'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'premium_007',
    name: 'Bonus Detective Cases',
    description: 'Exclusive detective mystery cases to solve.',
    category: 'premium',
    price: 400,
    icon: '🕵️',
    rarity: 'legendary',
    tags: ['detective', 'cases', 'exclusive'],
    isOwned: false,
    isPurchasable: true,
    requirements: {
      rank: 'Halach Uinic',
    },
  },
  {
    id: 'premium_008',
    name: 'Writing Excellence Pack',
    description: 'Advanced writing techniques and exercises.',
    category: 'premium',
    price: 290,
    icon: '✍️',
    rarity: 'epic',
    tags: ['writing', 'advanced', 'skills'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'premium_009',
    name: 'Research Skills Module',
    description: 'Professional research methodology training.',
    category: 'premium',
    price: 270,
    icon: '📊',
    rarity: 'epic',
    tags: ['research', 'methodology', 'skills'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'premium_010',
    name: 'Historical Context Library',
    description: 'Extensive historical context materials.',
    category: 'premium',
    price: 240,
    icon: '📜',
    rarity: 'rare',
    tags: ['history', 'context', 'library'],
    isOwned: false,
    isPurchasable: true,
  },
];

/**
 * SOCIAL FEATURES (10-50 ML)
 * Emotes, stickers, reaction packs, gifts
 */
const socialItems: ShopItem[] = [
  {
    id: 'social_001',
    name: 'Celebration Emote Pack',
    description: 'Fun celebration emotes for chat.',
    category: 'social',
    price: 25,
    icon: '🎉',
    rarity: 'common',
    tags: ['emote', 'celebration', 'chat'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'social_002',
    name: 'Science Sticker Set',
    description: 'Scientific-themed stickers for messages.',
    category: 'social',
    price: 30,
    icon: '⚛️',
    rarity: 'common',
    tags: ['sticker', 'science', 'messaging'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'social_003',
    name: 'Reaction Animation Pack',
    description: 'Animated reactions for social interactions.',
    category: 'social',
    price: 50,
    icon: '😄',
    rarity: 'rare',
    tags: ['reaction', 'animation', 'social'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'social_004',
    name: 'Gift Box',
    description: 'Send surprise gifts to friends!',
    category: 'social',
    price: 40,
    icon: '🎁',
    rarity: 'common',
    tags: ['gift', 'friend', 'social'],
    isOwned: false,
    isPurchasable: true,
    metadata: {
      stackable: true,
      tradeable: true,
    },
  },
  {
    id: 'social_005',
    name: 'Detective Emotes',
    description: 'Detective-themed emotes and expressions.',
    category: 'social',
    price: 35,
    icon: '🔍',
    rarity: 'common',
    tags: ['emote', 'detective', 'chat'],
    isOwned: false,
    isPurchasable: true,
  },
  {
    id: 'social_006',
    name: 'Kudos Token',
    description: 'Give kudos to helpful community members.',
    category: 'social',
    price: 10,
    icon: '👍',
    rarity: 'common',
    tags: ['kudos', 'appreciation', 'social'],
    isOwned: false,
    isPurchasable: true,
    metadata: {
      stackable: true,
      tradeable: false,
    },
  },
  {
    id: 'social_007',
    name: 'Virtual High Five',
    description: 'Send virtual high fives to teammates!',
    category: 'social',
    price: 15,
    icon: '✋',
    rarity: 'common',
    tags: ['gesture', 'team', 'social'],
    isOwned: false,
    isPurchasable: true,
    metadata: {
      stackable: true,
    },
  },
];

/**
 * All Shop Items Combined
 */
export const allShopItems: ShopItem[] = [
  ...cosmeticsItems,
  ...profileItems,
  ...guildItems,
  ...premiumItems,
  ...socialItems,
];

/**
 * Shop Items by Category
 */
export const shopItemsByCategory = {
  cosmetics: cosmeticsItems,
  profile: profileItems,
  guild: guildItems,
  premium: premiumItems,
  social: socialItems,
};

/**
 * Featured Items (high rarity or popular)
 */
export const featuredItems = allShopItems.filter(
  (item) => item.rarity === 'epic' || item.rarity === 'legendary'
);

/**
 * New Arrivals (last 10 items)
 */
export const newArrivals = allShopItems.slice(-10);

/**
 * Sale Items (random selection with discounts)
 * In production, this would have actual sale prices
 */
export const saleItems = allShopItems.filter((_, index) => index % 7 === 0).slice(0, 5);

/**
 * Get item by ID
 */
export const getShopItemById = (id: string): ShopItem | undefined => {
  return allShopItems.find((item) => item.id === id);
};

/**
 * Get items by category
 */
export const getItemsByCategory = (category: string): ShopItem[] => {
  return allShopItems.filter((item) => item.category === category);
};

/**
 * Get items by rarity
 */
export const getItemsByRarity = (rarity: string): ShopItem[] => {
  return allShopItems.filter((item) => item.rarity === rarity);
};

/**
 * Shop Statistics
 */
export const shopStats = {
  totalItems: allShopItems.length,
  categories: Object.keys(shopItemsByCategory).length,
  rarities: {
    common: allShopItems.filter((i) => i.rarity === 'common').length,
    rare: allShopItems.filter((i) => i.rarity === 'rare').length,
    epic: allShopItems.filter((i) => i.rarity === 'epic').length,
    legendary: allShopItems.filter((i) => i.rarity === 'legendary').length,
  },
  priceRange: {
    min: Math.min(...allShopItems.map((i) => i.price)),
    max: Math.max(...allShopItems.map((i) => i.price)),
    average: Math.round(
      allShopItems.reduce((sum, i) => sum + i.price, 0) / allShopItems.length
    ),
  },
};
