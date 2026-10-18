import type { OrderStatus } from '../api/types';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  Confirmed: 'מאושרת',
  Cancelled: 'בוטלה',
  Completed: 'הושלמה',
};
