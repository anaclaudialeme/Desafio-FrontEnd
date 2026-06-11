import { FlatCompat } from '@eslint/eslintrc';
import recommended from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: process.cwd()
});

export default compat.extendConfig(recommended);
