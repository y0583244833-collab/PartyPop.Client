import type { CartItem } from '../../api/types';
import { useRemoveCartItem, useUpdateCartItem } from '../../hooks/useCart';
import { formatPrice } from '../../utils/format';
import { ErrorMessage } from '../ErrorMessage';

export function CartItemRow({ item }: { item: CartItem }) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const busy = update.isPending || remove.isPending;

  return (
    <tr className={item.warning ? 'row-warning' : undefined}>
      <td>
        {item.productName}
        {/* אזהרה בלבד: הסל לא שומר מקום */}
        {item.warning && <div className="warning">⚠️ {item.warning}</div>}
        <ErrorMessage error={update.error} />
      </td>
      <td>
        <input type="number" min={1} max={item.available ?? undefined} defaultValue={item.quantity} disabled={busy}
               onBlur={(e) => {
                 let quantity = Number(e.target.value);
                 // לא יותר ממה שזמין בתאריך ובמשמרת של הסל
                 if (item.available !== null && quantity > item.available) {
                   quantity = Math.max(1, item.available);
                   e.target.value = String(quantity);
                 }
                 if (quantity >= 1 && quantity !== item.quantity) update.mutate({ itemId: item.id, quantity });
               }} />
      </td>
      <td>{item.available ?? '—'}</td>
      <td>{formatPrice(item.unitPrice * item.quantity)}</td>
      <td><button className="btn btn-link" disabled={busy} onClick={() => remove.mutate(item.id)}>הסרה</button></td>
    </tr>
  );
}
