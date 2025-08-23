import { useEffect, useState } from 'react';

// Breakpoint definitions (matching Tailwind CSS)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to get current screen size
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    breakpoint: Breakpoint | 'xs';
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    breakpoint: 'xs',
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: Breakpoint | 'xs' = 'xs';
      
      if (width >= breakpoints['2xl']) {
        breakpoint = '2xl';
      } else if (width >= breakpoints.xl) {
        breakpoint = 'xl';
      } else if (width >= breakpoints.lg) {
        breakpoint = 'lg';
      } else if (width >= breakpoints.md) {
        breakpoint = 'md';
      } else if (width >= breakpoints.sm) {
        breakpoint = 'sm';
      }

      setScreenSize({ width, height, breakpoint });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Hook to check if screen is at least a certain breakpoint
export const useBreakpoint = (breakpoint: Breakpoint) => {
  const { width } = useScreenSize();
  return width >= breakpoints[breakpoint];
};

// Hook to check if screen is mobile
export const useIsMobile = () => {
  const { breakpoint } = useScreenSize();
  return breakpoint === 'xs';
};

// Hook to check if screen is tablet
export const useIsTablet = () => {
  const { breakpoint } = useScreenSize();
  return breakpoint === 'sm' || breakpoint === 'md';
};

// Hook to check if screen is desktop
export const useIsDesktop = () => {
  const { breakpoint } = useScreenSize();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
};

// Utility function to get responsive classes
export const getResponsiveClasses = (config: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) => {
  const classes = [];
  
  if (config.base) classes.push(config.base);
  if (config.sm) classes.push(`sm:${config.sm}`);
  if (config.md) classes.push(`md:${config.md}`);
  if (config.lg) classes.push(`lg:${config.lg}`);
  if (config.xl) classes.push(`xl:${config.xl}`);
  if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
  
  return classes.join(' ');
};

// Utility function to get responsive values
export const getResponsiveValue = <T>(
  values: {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  currentBreakpoint: Breakpoint | 'xs'
): T | undefined => {
  // Return the most specific value for the current breakpoint
  if (currentBreakpoint === '2xl' && values['2xl']) return values['2xl'];
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl') && values.xl) return values.xl;
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg') && values.lg) return values.lg;
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg' || currentBreakpoint === 'md') && values.md) return values.md;
  if (currentBreakpoint !== 'xs' && values.sm) return values.sm;
  return values.base;
};

// Device detection utilities
export const deviceUtils = {
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoints.sm;
  },
  
  isTablet: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.lg;
  },
  
  isDesktop: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.lg;
  },
  
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    if (deviceUtils.isMobile()) return 'mobile';
    if (deviceUtils.isTablet()) return 'tablet';
    return 'desktop';
  }
};

// Responsive spacing utilities
export const spacing = {
  responsive: (config: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }) => getResponsiveClasses(config),
  
  padding: {
    responsive: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
      const sizes = {
        xs: { base: 'p-2', sm: 'sm:p-3', md: 'md:p-4' },
        sm: { base: 'p-3', sm: 'sm:p-4', md: 'md:p-6' },
        md: { base: 'p-4', sm: 'sm:p-6', md: 'md:p-8' },
        lg: { base: 'p-6', sm: 'sm:p-8', md: 'md:p-12' },
        xl: { base: 'p-8', sm: 'sm:p-12', md: 'md:p-16' }
      };
      return getResponsiveClasses(sizes[size]);
    }
  },
  
  margin: {
    responsive: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
      const sizes = {
        xs: { base: 'm-2', sm: 'sm:m-3', md: 'md:m-4' },
        sm: { base: 'm-3', sm: 'sm:m-4', md: 'md:m-6' },
        md: { base: 'm-4', sm: 'sm:m-6', md: 'md:m-8' },
        lg: { base: 'm-6', sm: 'sm:m-8', md: 'md:m-12' },
        xl: { base: 'm-8', sm: 'sm:m-12', md: 'md:m-16' }
      };
      return getResponsiveClasses(sizes[size]);
    }
  }
};

// Typography utilities
export const typography = {
  responsive: (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl') => {
    const sizes = {
      xs: { base: 'text-xs', sm: 'sm:text-sm' },
      sm: { base: 'text-sm', sm: 'sm:text-base' },
      base: { base: 'text-base', sm: 'sm:text-lg' },
      lg: { base: 'text-lg', sm: 'sm:text-xl' },
      xl: { base: 'text-xl', sm: 'sm:text-2xl' },
      '2xl': { base: 'text-2xl', sm: 'sm:text-3xl' },
      '3xl': { base: 'text-3xl', sm: 'sm:text-4xl' }
    };
    return getResponsiveClasses(sizes[size]);
  }
};
