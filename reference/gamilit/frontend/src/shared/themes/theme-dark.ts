import { colors } from '@shared/constants/colors';
import { Theme } from './theme-light';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
    },
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
      inverse: colors.gray[900],
    },
    border: {
      primary: colors.gray[700],
      secondary: colors.gray[600],
    },
    brand: {
      primary: colors.primary[500],
      secondary: colors.secondary[500],
    },
    success: colors.success[500],
    warning: colors.warning[500],
    danger: colors.danger[500],
    info: colors.info[500],
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },
};
