export const strykerConfig = {
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  reporters: ['html', 'console'],
  checkers: ['typescript'],
  mutate: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.test.ts', '!src/**/*.test.tsx']
};
