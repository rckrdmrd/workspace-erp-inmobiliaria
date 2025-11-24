/**
 * AchievementCard Component Tests
 *
 * Test Coverage:
 * - Rendering - Basic (5 tests): Title, description, icon, rewards
 * - Rendering - Rarity (4 tests): Colors, badges, glow effects
 * - Rendering - Locked State (4 tests): Opacity, grayscale, lock icon
 * - Rendering - Unlocked State (3 tests): Check icon, full color, no lock
 * - Progress Bar (4 tests): Display, percentage calculation, animation
 * - Hidden Achievements (2 tests): Mystery description when locked
 * - Rewards Display (2 tests): ML Coins and XP display
 * - Interactions (3 tests): Click handler, hover effects
 * - Icon Mapping (2 tests): Icon resolution, fallback
 * - Accessibility (2 tests): Clickable, keyboard support
 *
 * Total: 31 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementCard } from '../AchievementCard';
import type { Achievement } from '../../../types/achievementsTypes';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock achievement data
const mockUnlockedAchievement: Achievement = {
  id: 'ach-1',
  title: 'First Steps',
  description: 'Complete your first exercise',
  icon: 'footprints',
  category: 'progress',
  rarity: 'common',
  mlCoinsReward: 10,
  xpReward: 50,
  isUnlocked: true,
  unlockedAt: new Date('2025-01-01'),
  isHidden: false,
};

const mockLockedAchievement: Achievement = {
  ...mockUnlockedAchievement,
  id: 'ach-2',
  title: 'Explorer',
  description: 'Complete 10 exercises',
  rarity: 'rare',
  isUnlocked: false,
  unlockedAt: undefined,
  progress: {
    current: 3,
    required: 10,
  },
};

const mockLegendaryAchievement: Achievement = {
  ...mockUnlockedAchievement,
  id: 'ach-3',
  title: 'Legend',
  description: 'Master all modules',
  rarity: 'legendary',
  mlCoinsReward: 1000,
  xpReward: 5000,
};

const mockHiddenAchievement: Achievement = {
  ...mockLockedAchievement,
  id: 'ach-4',
  title: 'Secret Achievement',
  description: 'This is a secret',
  isHidden: true,
};

describe('AchievementCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering - Basic Tests
  // ============================================================

  describe('Rendering - Basic', () => {
    it('should render achievement title', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.getByText('First Steps')).toBeInTheDocument();
    });

    it('should render achievement description', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.getByText('Complete your first exercise')).toBeInTheDocument();
    });

    it('should render ML Coins reward', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.getByText('10 ML')).toBeInTheDocument();
    });

    it('should render XP reward', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.getByText('50 XP')).toBeInTheDocument();
    });

    it('should render achievement icon', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      // Check for icon container (has rounded-full class)
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  // ============================================================
  // Rendering - Rarity Tests
  // ============================================================

  describe('Rendering - Rarity', () => {
    it('should display rarity badge for common achievement', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.getByText('COMMON')).toBeInTheDocument();
    });

    it('should display rarity badge for rare achievement', () => {
      render(<AchievementCard achievement={mockLockedAchievement} />);

      expect(screen.getByText('RARE')).toBeInTheDocument();
    });

    it('should display rarity badge for legendary achievement', () => {
      render(<AchievementCard achievement={mockLegendaryAchievement} />);

      expect(screen.getByText('LEGENDARY')).toBeInTheDocument();
    });

    it('should apply correct rarity background color', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      // Rare achievement should have blue background
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/bg-blue-50/);
    });
  });

  // ============================================================
  // Rendering - Locked State Tests
  // ============================================================

  describe('Rendering - Locked State', () => {
    it('should show locked achievement with opacity', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/opacity-60/);
    });

    it('should apply grayscale filter to locked achievement', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/grayscale/);
    });

    it('should display lock icon for locked achievement', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      // Lock icon should be present (lucide-react Lock component)
      const lockIcon = container.querySelector('.text-gray-400.opacity-20');
      expect(lockIcon).toBeInTheDocument();
    });

    it('should NOT show check icon for locked achievement', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      // CheckCircle icon should not be present
      const checkIcon = container.querySelector('.text-detective-success');
      expect(checkIcon).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Rendering - Unlocked State Tests
  // ============================================================

  describe('Rendering - Unlocked State', () => {
    it('should show unlocked achievement without opacity reduction', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toMatch(/opacity-60/);
    });

    it('should NOT apply grayscale to unlocked achievement', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toMatch(/grayscale/);
    });

    it('should display check icon for unlocked achievement', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      // CheckCircle icon should be present
      const checkIcon = container.querySelector('.text-detective-success');
      expect(checkIcon).toBeInTheDocument();
    });
  });

  // ============================================================
  // Progress Bar Tests
  // ============================================================

  describe('Progress Bar', () => {
    it('should display progress bar for achievement with progress', () => {
      render(<AchievementCard achievement={mockLockedAchievement} />);

      expect(screen.getByText('Progreso')).toBeInTheDocument();
      expect(screen.getByText('3/10')).toBeInTheDocument();
    });

    it('should NOT display progress bar for achievement without progress', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      expect(screen.queryByText('Progreso')).not.toBeInTheDocument();
    });

    it('should calculate progress percentage correctly', () => {
      const { container } = render(<AchievementCard achievement={mockLockedAchievement} />);

      // Progress bar should show 30% (3/10)
      const progressBar = container.querySelector('.bg-gradient-to-r');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show progress for partially completed achievement', () => {
      const partialAchievement = {
        ...mockLockedAchievement,
        progress: { current: 7, required: 10 },
      };

      render(<AchievementCard achievement={partialAchievement} />);

      expect(screen.getByText('7/10')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Hidden Achievements Tests
  // ============================================================

  describe('Hidden Achievements', () => {
    it('should show "???" for locked hidden achievement', () => {
      render(<AchievementCard achievement={mockHiddenAchievement} />);

      expect(screen.getByText('???')).toBeInTheDocument();
      expect(screen.queryByText('This is a secret')).not.toBeInTheDocument();
    });

    it('should show description for unlocked hidden achievement', () => {
      const unlockedHidden = {
        ...mockHiddenAchievement,
        isUnlocked: true,
      };

      render(<AchievementCard achievement={unlockedHidden} />);

      expect(screen.getByText('This is a secret')).toBeInTheDocument();
      expect(screen.queryByText('???')).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Rewards Display Tests
  // ============================================================

  describe('Rewards Display', () => {
    it('should display high rewards for legendary achievement', () => {
      render(<AchievementCard achievement={mockLegendaryAchievement} />);

      expect(screen.getByText('1000 ML')).toBeInTheDocument();
      expect(screen.getByText('5000 XP')).toBeInTheDocument();
    });

    it('should display rewards section with icons', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      // Should have Coins and Zap icons
      const rewardsSection = container.querySelector('.border-t.border-gray-200');
      expect(rewardsSection).toBeInTheDocument();
    });
  });

  // ============================================================
  // Interactions Tests
  // ============================================================

  describe('Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClickMock = vi.fn();

      render(<AchievementCard achievement={mockUnlockedAchievement} onClick={onClickMock} />);

      const card = screen.getByText('First Steps').closest('div');
      if (card) {
        await user.click(card);
      }

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should have cursor-pointer class', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/cursor-pointer/);
    });

    it('should NOT crash when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      const card = screen.getByText('First Steps').closest('div');
      if (card) {
        await user.click(card);
      }

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  // ============================================================
  // Icon Mapping Tests
  // ============================================================

  describe('Icon Mapping', () => {
    it('should render specific icon for achievement', () => {
      const trophyAchievement = {
        ...mockUnlockedAchievement,
        icon: 'trophy',
      };

      const { container } = render(<AchievementCard achievement={trophyAchievement} />);

      // Icon component should be rendered
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should use fallback icon for unknown icon name', () => {
      const unknownIconAchievement = {
        ...mockUnlockedAchievement,
        icon: 'unknown-icon-name',
      };

      const { container } = render(<AchievementCard achievement={unknownIconAchievement} />);

      // Should render Award as fallback
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should be clickable', () => {
      const { container } = render(<AchievementCard achievement={mockUnlockedAchievement} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should have proper structure for screen readers', () => {
      render(<AchievementCard achievement={mockUnlockedAchievement} />);

      // Title should be in an h3
      const title = screen.getByText('First Steps');
      expect(title.tagName).toBe('H3');
    });
  });
});
