import { colors } from '@shared/constants/colors';

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    // Text colors
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    // Border colors
    border: {
      primary: string;
      secondary: string;
    };
    // Brand colors
    brand: {
      primary: string;
      secondary: string;
    };
    // Semantic colors
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: {
      primary: colors.white,
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      tertiary: colors.gray[500],
      inverse: colors.white,
    },
    border: {
      primary: colors.gray[200],
      secondary: colors.gray[300],
    },
    brand: {
      primary: colors.primary[600],
      secondary: colors.secondary[600],
    },
    success: colors.success[600],
    warning: colors.warning[600],
    danger: colors.danger[600],
    info: colors.info[600],
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },
};
