/**
 * ProgressBar Component Tests
 *
 * Test Coverage:
 * - Rendering - Basic (4 tests): Progress display, role, aria attributes
 * - Progress Value (5 tests): Clamping, 0%, 50%, 100%, overflow
 * - Variants (2 tests): Detective and XP variants
 * - Height Options (3 tests): sm, md, lg heights
 * - Label Display (4 tests): Show/hide label, custom label, percentage
 * - Animation (2 tests): Animated vs static
 * - Accessibility (4 tests): ARIA attributes, role, labels
 * - Edge Cases (2 tests): Negative values, > 100 values
 *
 * Total: 26 tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock cn utility
vi.mock('@shared/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('ProgressBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering - Basic Tests
  // ============================================================

  describe('Rendering - Basic', () => {
    it('should render progress bar', () => {
      render(<ProgressBar progress={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should have correct ARIA role', () => {
      render(<ProgressBar progress={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('role', 'progressbar');
    });

    it('should have ARIA valuenow attribute', () => {
      render(<ProgressBar progress={75} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('should have ARIA valuemin and valuemax attributes', () => {
      render(<ProgressBar progress={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  // ============================================================
  // Progress Value Tests
  // ============================================================

  describe('Progress Value', () => {
    it('should display 0% progress', () => {
      render(<ProgressBar progress={0} showLabel />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should display 50% progress', () => {
      render(<ProgressBar progress={50} showLabel />);

      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should display 100% progress', () => {
      render(<ProgressBar progress={100} showLabel />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should clamp negative values to 0', () => {
      render(<ProgressBar progress={-50} showLabel />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should clamp values > 100 to 100', () => {
      render(<ProgressBar progress={150} showLabel />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Variants Tests
  // ============================================================

  describe('Variants', () => {
    it('should apply detective variant styles', () => {
      render(<ProgressBar progress={50} variant="detective" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar.className).toContain('progress-detective');
    });

    it('should apply xp variant styles', () => {
      render(<ProgressBar progress={50} variant="xp" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar.className).toContain('progress-xp');
    });
  });

  // ============================================================
  // Height Options Tests
  // ============================================================

  describe('Height Options', () => {
    it('should apply sm height', () => {
      render(<ProgressBar progress={50} height="sm" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar.className).toContain('h-1.5');
    });

    it('should apply md height (default)', () => {
      render(<ProgressBar progress={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar.className).toContain('h-2.5');
    });

    it('should apply lg height', () => {
      render(<ProgressBar progress={50} height="lg" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar.className).toContain('h-3');
    });
  });

  // ============================================================
  // Label Display Tests
  // ============================================================

  describe('Label Display', () => {
    it('should NOT show label by default', () => {
      render(<ProgressBar progress={50} />);

      expect(screen.queryByText('Progreso')).not.toBeInTheDocument();
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('should show default label when showLabel is true', () => {
      render(<ProgressBar progress={50} showLabel />);

      expect(screen.getByText('Progreso')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should show custom label', () => {
      render(<ProgressBar progress={75} showLabel label="Module Progress" />);

      expect(screen.getByText('Module Progress')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should display percentage with label', () => {
      render(<ProgressBar progress={33} showLabel label="Loading" />);

      expect(screen.getByText('Loading')).toBeInTheDocument();
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });

  // ============================================================
  // Animation Tests
  // ============================================================

  describe('Animation', () => {
    it('should use animated progress fill by default', () => {
      const { container } = render(<ProgressBar progress={50} />);

      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toBeInTheDocument();
    });

    it('should use static progress fill when animated is false', () => {
      const { container } = render(<ProgressBar progress={50} animated={false} />);

      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toBeInTheDocument();
      expect(progressFill).toHaveStyle({ width: '50%' });
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should have default aria-label', () => {
      render(<ProgressBar progress={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Progreso');
    });

    it('should have custom aria-label', () => {
      render(<ProgressBar progress={50} label="Loading Resources" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Loading Resources');
    });

    it('should have correct aria-valuenow matching progress', () => {
      render(<ProgressBar progress={67} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '67');
    });

    it('should have aria-valuenow reflecting clamped value', () => {
      render(<ProgressBar progress={250} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });

  // ============================================================
  // Edge Cases Tests
  // ============================================================

  describe('Edge Cases', () => {
    it('should handle very small progress values', () => {
      render(<ProgressBar progress={0.5} showLabel />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0.5');
    });

    it('should handle decimal progress values', () => {
      render(<ProgressBar progress={33.33} showLabel />);

      expect(screen.getByText('33.33%')).toBeInTheDocument();
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33');
    });
  });

  // ============================================================
  // Additional Props Tests
  // ============================================================

  describe('Additional Props', () => {
    it('should apply custom className', () => {
      const { container } = render(<ProgressBar progress={50} className="custom-class" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ProgressBar progress={50} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
