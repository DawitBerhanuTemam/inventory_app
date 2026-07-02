/**
 * Application color palette — single source of truth.
 * Replaces the `const C = {...}` pattern duplicated across every screen file.
 */
export const AppColors = {
  background: '#F2F2F2',
  card: '#FFFFFF',
  text: '#0A0A0A',
  textSecondary: '#7A7A7A',
  border: '#E5E5E5',
  /** Green — used for in-stock badges */
  success: '#2D7A47',
  successLight: '#EBF5EE',
  /** Amber — used for low-stock badges */
  warning: '#B45309',
  warningLight: '#FEF3C7',
  /** Red — used for out-of-stock badges and error states */
  danger: '#C0392B',
  dangerLight: '#FCECEA',
} as const;

export type AppColor = keyof typeof AppColors;
