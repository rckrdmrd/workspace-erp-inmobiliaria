import React from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useSwipeableElement } from '../../hooks/useSwipeGesture';

interface SwipeableContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
}

export function SwipeableContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
  enablePullToRefresh = false,
  onRefresh,
}: SwipeableContainerProps) {
  const controls = useAnimation();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);

  const { elementRef, isSwiping } = useSwipeableElement({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold,
  });

  const handlePanStart = () => {
    setPullDistance(0);
  };

  const handlePan = (event: PointerEvent, info: PanInfo) => {
    if (!enablePullToRefresh || window.scrollY > 0) return;

    const distance = Math.max(0, info.offset.y);
    setPullDistance(Math.min(distance, 120));
  };

  const handlePanEnd = async (event: PointerEvent, info: PanInfo) => {
    if (!enablePullToRefresh || !onRefresh) {
      setPullDistance(0);
      return;
    }

    if (info.offset.y > 80 && window.scrollY === 0) {
      setIsRefreshing(true);
      await controls.start({ y: 60 });

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        await controls.start({ y: 0 });
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
      await controls.start({ y: 0 });
    }
  };

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      drag={enablePullToRefresh ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.3, bottom: 0 }}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      animate={controls}
      style={{
        touchAction: 'pan-y',
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && pullDistance > 0 && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{
            opacity: pullDistance > 40 ? 1 : pullDistance / 40,
            y: -40 + pullDistance / 2,
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-detective-bg-secondary">
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : pullDistance * 3,
              }}
              transition={{
                rotate: isRefreshing
                  ? {
                      repeat: Infinity,
                      duration: 1,
                      ease: 'linear',
                    }
                  : { duration: 0 },
              }}
              className="text-detective-orange"
            >
              {isRefreshing ? '⟳' : '↓'}
            </motion.div>
            <span className="text-sm font-medium text-detective-text">
              {isRefreshing
                ? 'Actualizando...'
                : pullDistance > 80
                ? 'Suelta para actualizar'
                : 'Desliza para actualizar'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Touch feedback */}
      {isSwiping && (
        <motion.div
          className="absolute inset-0 bg-detective-orange pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          exit={{ opacity: 0 }}
        />
      )}

      {children}
    </motion.div>
  );
}
