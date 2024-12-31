import { it } from 'vitest';
import { formatAmount } from '../app/utils/helpers';

it('formate amount', () => {
  const formated = formatAmount('1e-16', 2, { format: true });
  console.log(formated);
});
