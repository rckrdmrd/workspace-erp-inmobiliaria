import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;

  const touchStartRef = useRef<TouchPosition>({ x: 0, y: 0 });
  const touchEndRef = useRef<TouchPosition>({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Horizontal swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    // Vertical swipe
    if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setIsSwiping(false);
  };

  return {
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

export function useSwipeableElement(options: SwipeGestureOptions) {
  const elementRef = useRef<HTMLDivElement>(null);
  const gesture = useSwipeGesture(options);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', gesture.handleTouchStart, { passive: true });
    element.addEventListener('touchmove', gesture.handleTouchMove, { passive: true });
    element.addEventListener('touchend', gesture.handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', gesture.handleTouchStart);
      element.removeEventListener('touchmove', gesture.handleTouchMove);
      element.removeEventListener('touchend', gesture.handleTouchEnd);
    };
  }, [gesture]);

  return {
    elementRef,
    isSwiping: gesture.isSwiping,
  };
}
