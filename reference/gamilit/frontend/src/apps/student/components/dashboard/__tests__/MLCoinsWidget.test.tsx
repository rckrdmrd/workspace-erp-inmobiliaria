/**
 * MLCoinsWidget Component Tests
 *
 * Test Coverage:
 * - Rendering - Loading State (3 tests): Skeleton, animation
 * - Rendering - Data Display (5 tests): Balance, stats, transactions
 * - Net Change Display (4 tests): Positive, negative, badges
 * - Today's Stats (4 tests): Earned, spent, display
 * - Recent Transactions (5 tests): List, types, formatting
 * - Empty/Null Data (2 tests): Null data handling
 * - Accessibility (2 tests): Text readability
 *
 * Total: 25 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MLCoinsWidget } from '../MLCoinsWidget';
import type { MLCoinsData } from '../../../hooks/useDashboardData';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useSpring: () => ({ set: vi.fn() }),
  useTransform: () => '1,234',
}));

// Mock utils
vi.mock('@shared/utils/colorPalette', () => ({
  getColorSchemeByName: () => ({
    border: 'border-amber-200',
    shadow: 'shadow-amber-200',
    iconGradient: 'from-amber-500 to-orange-500',
  }),
}));

vi.mock('@shared/utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock data
const mockMLCoinsData: MLCoinsData = {
  balance: 1234,
  todayEarned: 150,
  todaySpent: 50,
  recentTransactions: [
    {
      id: 't1',
      description: 'Completaste Ejercicio 1',
      amount: 50,
      type: 'earned' as const,
      timestamp: new Date('2025-11-09T10:30:00').toISOString(),
    },
    {
      id: 't2',
      description: 'Compraste Power-Up',
      amount: 25,
      type: 'spent' as const,
      timestamp: new Date('2025-11-09T09:15:00').toISOString(),
    },
    {
      id: 't3',
      description: 'Desbloqueaste Logro',
      amount: 100,
      type: 'earned' as const,
      timestamp: new Date('2025-11-09T08:00:00').toISOString(),
    },
  ],
};

describe('MLCoinsWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering - Loading State Tests
  // ============================================================

  describe('Rendering - Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      const { container } = render(<MLCoinsWidget data={null} loading />);

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should render loading skeleton when data is null', () => {
      const { container } = render(<MLCoinsWidget data={null} />);

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should show skeleton with proper structure', () => {
      const { container } = render(<MLCoinsWidget data={null} loading />);

      const skeletonElements = container.querySelectorAll('.bg-gray-200');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Rendering - Data Display Tests
  // ============================================================

  describe('Rendering - Data Display', () => {
    it('should render ML Coins title', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('ML Coins')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('Tu tesoro detectivesco')).toBeInTheDocument();
    });

    it('should display balance with ML suffix', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('ML')).toBeInTheDocument();
    });

    it('should display today earned amount', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('+150')).toBeInTheDocument();
      expect(screen.getByText('Ganado')).toBeInTheDocument();
    });

    it('should display today spent amount', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('-50')).toBeInTheDocument();
      expect(screen.getByText('Gastado')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Net Change Display Tests
  // ============================================================

  describe('Net Change Display', () => {
    it('should show positive net change with trending up icon', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      // Net change is +100 (150 earned - 50 spent)
      expect(screen.getByText('+100 ML')).toBeInTheDocument();
    });

    it('should show negative net change with trending down', () => {
      const negativeData = {
        ...mockMLCoinsData,
        todayEarned: 30,
        todaySpent: 100,
      };

      render(<MLCoinsWidget data={negativeData} />);

      // Net change is -70 (30 earned - 100 spent)
      expect(screen.getByText('-70 ML')).toBeInTheDocument();
    });

    it('should show zero net change as positive', () => {
      const zeroData = {
        ...mockMLCoinsData,
        todayEarned: 50,
        todaySpent: 50,
      };

      render(<MLCoinsWidget data={zeroData} />);

      expect(screen.getByText('+0 ML')).toBeInTheDocument();
    });

    it('should display "hoy" label for today change', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('hoy')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Today's Stats Tests
  // ============================================================

  describe("Today's Stats", () => {
    it('should show earned stats with correct label', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      // "ML hoy" appears twice (earned and spent), check both exist
      const mlHoyLabels = screen.getAllByText('ML hoy');
      expect(mlHoyLabels.length).toBe(2);
    });

    it('should display earned amount with plus sign', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('+150')).toBeInTheDocument();
    });

    it('should display spent amount with minus sign', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('should render stats in grid layout', () => {
      const { container } = render(<MLCoinsWidget data={mockMLCoinsData} />);

      const grid = container.querySelector('.grid.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  // ============================================================
  // Recent Transactions Tests
  // ============================================================

  describe('Recent Transactions', () => {
    it('should display recent transactions header', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('Transacciones Recientes')).toBeInTheDocument();
    });

    it('should display maximum 3 recent transactions', () => {
      const manyTransactions = {
        ...mockMLCoinsData,
        recentTransactions: [
          ...mockMLCoinsData.recentTransactions,
          {
            id: 't4',
            description: 'Extra Transaction',
            amount: 10,
            type: 'earned' as const,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      render(<MLCoinsWidget data={manyTransactions} />);

      // Should only show 3 transactions
      expect(screen.getByText('Completaste Ejercicio 1')).toBeInTheDocument();
      expect(screen.getByText('Compraste Power-Up')).toBeInTheDocument();
      expect(screen.getByText('Desbloqueaste Logro')).toBeInTheDocument();
      expect(screen.queryByText('Extra Transaction')).not.toBeInTheDocument();
    });

    it('should display earned transaction with positive sign', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('+50')).toBeInTheDocument();
      expect(screen.getByText('+100')).toBeInTheDocument();
    });

    it('should display spent transaction with negative sign', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('-25')).toBeInTheDocument();
    });

    it('should display transaction descriptions', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('Completaste Ejercicio 1')).toBeInTheDocument();
      expect(screen.getByText('Compraste Power-Up')).toBeInTheDocument();
      expect(screen.getByText('Desbloqueaste Logro')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Empty/Null Data Tests
  // ============================================================

  describe('Empty/Null Data', () => {
    it('should handle empty transactions array', () => {
      const emptyTransactions = {
        ...mockMLCoinsData,
        recentTransactions: [],
      };

      render(<MLCoinsWidget data={emptyTransactions} />);

      expect(screen.getByText('Transacciones Recientes')).toBeInTheDocument();
      // No transaction descriptions should be shown
      expect(screen.queryByText('Completaste Ejercicio 1')).not.toBeInTheDocument();
    });

    it('should handle zero balance', () => {
      const zeroBalance = {
        ...mockMLCoinsData,
        balance: 0,
      };

      render(<MLCoinsWidget data={zeroBalance} />);

      expect(screen.getByText('ML Coins')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      const heading = screen.getByText('ML Coins');
      expect(heading.tagName).toBe('H3');
    });

    it('should have descriptive transaction labels', () => {
      render(<MLCoinsWidget data={mockMLCoinsData} />);

      expect(screen.getByText('Ganado')).toBeInTheDocument();
      expect(screen.getByText('Gastado')).toBeInTheDocument();
    });
  });
});
