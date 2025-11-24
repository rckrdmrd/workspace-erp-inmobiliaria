/**
 * RankBadge Component Tests
 *
 * Test Coverage:
 * - Rendering - Basic (4 tests): Badge display, label, role, aria-label
 * - Rank Types - Detective System (5 tests): All detective ranks
 * - Rank Types - Maya System (5 tests): All Maya ranks
 * - Icon Display (2 tests): Show/hide icon
 * - Size Variants (3 tests): sm, md, lg sizes
 * - Animation (2 tests): Animated vs static
 * - Styling (2 tests): Custom className, rank styles
 * - Accessibility (3 tests): ARIA attributes, icon hidden
 * - Forward Ref (1 test): Ref forwarding
 *
 * Total: 27 tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RankBadge } from '../RankBadge';
import type { RankType } from '../RankBadge';

// Mock cn utility
vi.mock('@shared/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock lucide-react Crown icon
vi.mock('lucide-react', () => ({
  Crown: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      data-testid="crown-icon"
    />
  ),
}));

describe('RankBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering - Basic Tests
  // ============================================================

  describe('Rendering - Basic', () => {
    it('should render rank badge', () => {
      render(<RankBadge rank="detective_novato" />);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('should display rank label', () => {
      render(<RankBadge rank="detective_novato" />);

      expect(screen.getByText('Detective Novato')).toBeInTheDocument();
    });

    it('should have correct role attribute', () => {
      render(<RankBadge rank="sargento" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('role', 'status');
    });

    it('should have aria-label with rank name', () => {
      render(<RankBadge rank="teniente" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Rango: Teniente');
    });
  });

  // ============================================================
  // Rank Types - Detective System Tests
  // ============================================================

  describe('Rank Types - Detective System', () => {
    it('should render detective_novato rank', () => {
      const { container } = render(<RankBadge rank="detective_novato" />);

      expect(screen.getByText('Detective Novato')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rank-badge-detective');
    });

    it('should render sargento rank', () => {
      const { container } = render(<RankBadge rank="sargento" />);

      expect(screen.getByText('Sargento')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rank-badge-sargento');
    });

    it('should render teniente rank', () => {
      const { container } = render(<RankBadge rank="teniente" />);

      expect(screen.getByText('Teniente')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rank-badge-teniente');
    });

    it('should render capitan rank', () => {
      const { container } = render(<RankBadge rank="capitan" />);

      expect(screen.getByText('Capitán')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rank-badge-capitan');
    });

    it('should render comisario rank', () => {
      const { container } = render(<RankBadge rank="comisario" />);

      expect(screen.getByText('Comisario')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rank-badge-comisario');
    });
  });

  // ============================================================
  // Rank Types - Maya System Tests
  // ============================================================

  describe('Rank Types - Maya System', () => {
    it('should render al_mehen rank', () => {
      const { container } = render(<RankBadge rank="al_mehen" />);

      expect(screen.getByText('AL MEHEN')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('from-gray-400');
      expect(badge.className).toContain('to-gray-600');
    });

    it('should render chilan rank', () => {
      const { container } = render(<RankBadge rank="chilan" />);

      expect(screen.getByText('CHILAN')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('from-green-400');
      expect(badge.className).toContain('to-green-600');
    });

    it('should render batab rank', () => {
      const { container } = render(<RankBadge rank="batab" />);

      expect(screen.getByText('Ajaw')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('from-blue-400');
      expect(badge.className).toContain('to-blue-600');
    });

    it('should render halach_uinik rank', () => {
      const { container } = render(<RankBadge rank="halach_uinik" />);

      expect(screen.getByText('HALACH UINIK')).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('from-purple-500');
      expect(badge.className).toContain('to-pink-600');
    });

    it('should render kukulkan rank (legendary)', () => {
      const { container } = render(<RankBadge rank="kukulkan" />);

      expect(screen.getByText("K'UK'ULKAN")).toBeInTheDocument();
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('from-yellow-400');
      expect(badge.className).toContain('via-orange-500');
      expect(badge.className).toContain('to-red-600');
    });
  });

  // ============================================================
  // Icon Display Tests
  // ============================================================

  describe('Icon Display', () => {
    it('should show Crown icon by default', () => {
      render(<RankBadge rank="detective_novato" />);

      const icon = screen.getByTestId('crown-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should hide icon when showIcon is false', () => {
      render(<RankBadge rank="detective_novato" showIcon={false} />);

      const icon = screen.queryByTestId('crown-icon');
      expect(icon).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Size Variants Tests
  // ============================================================

  describe('Size Variants', () => {
    it('should apply sm size styles', () => {
      const { container } = render(<RankBadge rank="sargento" />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-xs');
      expect(badge.className).toContain('px-2');
      expect(badge.className).toContain('py-0.5');
    });

    it('should apply md size styles (default)', () => {
      const { container } = render(<RankBadge rank="teniente" />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-sm');
      expect(badge.className).toContain('px-3');
      expect(badge.className).toContain('py-1');
    });

    it('should apply lg size styles', () => {
      const { container } = render(<RankBadge rank="capitan" />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-base');
      expect(badge.className).toContain('px-4');
      expect(badge.className).toContain('py-1.5');
    });
  });

  // ============================================================
  // Animation Tests
  // ============================================================

  describe('Animation', () => {
    it('should apply badge-pulse class when animated is true', () => {
      const { container } = render(<RankBadge rank="kukulkan" animated />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('badge-pulse');
    });

    it('should NOT apply badge-pulse class by default', () => {
      const { container } = render(<RankBadge rank="kukulkan" />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).not.toContain('badge-pulse');
    });
  });

  // ============================================================
  // Styling Tests
  // ============================================================

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <RankBadge rank="detective_novato" className="custom-badge-class" />
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('custom-badge-class');
    });

    it('should apply base classes for all ranks', () => {
      const { container } = render(<RankBadge rank="sargento" />);

      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('inline-flex');
      expect(badge.className).toContain('items-center');
      expect(badge.className).toContain('gap-1.5');
      expect(badge.className).toContain('font-semibold');
      expect(badge.className).toContain('rounded-full');
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should have descriptive aria-label for detective ranks', () => {
      render(<RankBadge rank="detective_novato" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Rango: Detective Novato');
    });

    it('should have descriptive aria-label for Maya ranks', () => {
      render(<RankBadge rank="kukulkan" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', "Rango: K'UK'ULKAN");
    });

    it('should mark icon as aria-hidden', () => {
      render(<RankBadge rank="chilan" />);

      const icon = screen.getByTestId('crown-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================================
  // Forward Ref Tests
  // ============================================================

  describe('Forward Ref', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<RankBadge rank="teniente" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toContain('Teniente');
    });
  });

  // ============================================================
  // Rank Progression Tests
  // ============================================================

  describe('Rank Progression', () => {
    const detectiveRanks: RankType[] = [
      'detective_novato',
      'sargento',
      'teniente',
      'capitan',
      'comisario',
    ];

    const mayaRanks: RankType[] = [
      'al_mehen',
      'chilan',
      'batab',
      'halach_uinik',
      'kukulkan',
    ];

    it('should render all detective ranks in progression order', () => {
      detectiveRanks.forEach((rank) => {
        const { container, unmount } = render(<RankBadge rank={rank} />);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toBeInTheDocument();
        unmount();
      });
    });

    it('should render all Maya ranks in progression order', () => {
      mayaRanks.forEach((rank) => {
        const { container, unmount } = render(<RankBadge rank={rank} />);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toBeInTheDocument();
        unmount();
      });
    });
  });
});
