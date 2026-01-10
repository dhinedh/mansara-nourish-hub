import * as React from "react";

// ========================================
// OPTIMIZED USE IS MOBILE HOOK
// ========================================
// Improvements:
// - Better performance
// - Debounced resize listener
// - SSR support
// ========================================

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkMobile();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener('change', checkMobile);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize);
    }

    return () => {
      clearTimeout(timeoutId);
      if (mql.removeEventListener) {
        mql.removeEventListener('change', checkMobile);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return !!isMobile;
}