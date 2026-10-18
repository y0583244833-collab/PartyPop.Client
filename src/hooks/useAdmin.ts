import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, type OrderQuery } from '../api/endpoints';

/**
 * פעולת מנהל: אחרי הצלחה מרעננים את המפתחות שהשתנו.
 * hook אחד גנרי במקום לשכפל useMutation לכל פעולה.
 */
export function useAdminMutation<TArgs>(
  fn: (args: TArgs) => Promise<unknown>,
  invalidate: string[][],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  });
}

export function useAdminOrders(query: OrderQuery) {
  return useQuery({
    queryKey: ['admin-orders', query],
    queryFn: () => adminApi.orders(query),
    placeholderData: keepPreviousData,
  });
}
