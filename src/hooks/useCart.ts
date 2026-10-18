import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi, ordersApi } from '../api/endpoints';
import type { Shift } from '../api/types';

const CART_KEY = ['cart'];

export function useCart() {
  return useQuery({ queryKey: CART_KEY, queryFn: cartApi.get });
}

/** כל פעולה על הסל מרעננת אותו (ואת הזמינות בקטלוג). */
function useCartMutation<TArgs>(fn: (args: TArgs) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export const useSetCartDate = () =>
  useCartMutation(({ eventDate, shift }: { eventDate: string; shift: Shift }) => cartApi.setDate(eventDate, shift));

export const useAddToCart = () =>
  useCartMutation(({ productId, quantity }: { productId: number; quantity: number }) => cartApi.addItem(productId, quantity));

export const useUpdateCartItem = () =>
  useCartMutation(({ itemId, quantity }: { itemId: number; quantity: number }) => cartApi.updateItem(itemId, quantity));

export const useRemoveCartItem = () => useCartMutation((itemId: number) => cartApi.removeItem(itemId));

/** אישור הזמנה: הפעולה על המשאב המוגבל. */
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventAddress, contactPhone }: { eventAddress: string; contactPhone: string }) =>
      ordersApi.checkout(eventAddress, contactPhone),
    // גם בהצלחה וגם ב-409 הזמינות השתנתה, ולכן מרעננים הכול
    onSettled: () => queryClient.invalidateQueries(),
  });
}
