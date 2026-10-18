import { useLocation } from 'react-router-dom';
import { useCancelOrder, useMyOrders } from '../hooks/useOrders';
import { SHIFT_LABELS } from '../api/types';
import { STATUS_LABELS } from '../utils/labels';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatDate, formatPrice } from '../utils/format';

export function OrdersPage() {
  const orders = useMyOrders();
  const cancel = useCancelOrder();
  const createdId = (useLocation().state as { createdId?: number } | null)?.createdId;

  if (orders.isLoading) return <Loading />;

  return (
    <section>
      <h2>ההזמנות שלי</h2>
      {createdId && <div className="alert alert-success">ההזמנה #{createdId} נקלטה בהצלחה 🎉</div>}
      <ErrorMessage error={orders.error ?? cancel.error} />

      {orders.data?.length === 0 && <p>אין עדיין הזמנות.</p>}
      {orders.data?.map((order) => (
        <article key={order.id} className={`order order-${order.status.toLowerCase()}`}>
          <header>
            <b>הזמנה #{order.id}</b> · {formatDate(order.eventDate)} · {SHIFT_LABELS[order.shift]}
            <span className="badge">{STATUS_LABELS[order.status]}</span>
          </header>
          <ul>
            {order.items.map((i) => (
              <li key={i.productId}>{i.productName} × {i.quantity} ({formatPrice(i.unitPrice)})</li>
            ))}
          </ul>
          <footer>
            <span>סה"כ: <b>{formatPrice(order.totalPrice)}</b></span>
            {order.status === 'Confirmed' && (
              <button className="btn btn-danger" disabled={cancel.isPending}
                      onClick={() => cancel.mutate(order.id)}>
                ביטול (עד 48 שעות לפני)
              </button>
            )}
          </footer>
        </article>
      ))}
    </section>
  );
}
