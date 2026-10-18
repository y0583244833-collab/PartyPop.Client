import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/endpoints';

export function useMyOrders() {
  return useQuery({ queryKey: ['orders', 'me'], queryFn: ordersApi.mine });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.cancel(id),
    onSettled: () => queryClient.invalidateQueries(),
  });
}
