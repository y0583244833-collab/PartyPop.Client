import { useState } from 'react';
import { adminApi, type OrderQuery } from '../../api/endpoints';
import { SHIFT_LABELS, type OrderStatus, type Shift } from '../../api/types';
import { useAdminMutation, useAdminOrders } from '../../hooks/useAdmin';
import { STATUS_LABELS } from '../../utils/labels';
import { formatDate, formatPrice } from '../../utils/format';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';

export function AdminOrdersPage() {
  const [query, setQuery] = useState<OrderQuery>({ page: 1, pageSize: 10, sortBy: 'eventDate', sortDir: 'desc' });
  const orders = useAdminOrders(query);
  const setStatus = useAdminMutation(
    ({ id, status }: { id: number; status: 'Cancelled' | 'Completed' }) => adminApi.setOrderStatus(id, status),
    [['admin-orders'], ['products']],
  );

  const filter = (changes: Partial<OrderQuery>) => setQuery((q) => ({ ...q, ...changes, page: 1 }));

  return (
    <section>
      <h2>היסטוריית הזמנות</h2>
      <div className="filters">
        <select onChange={(e) => filter({ status: (e.target.value || undefined) as OrderStatus | undefined })}>
          <option value="">כל הסטטוסים</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select onChange={(e) => filter({ shift: (e.target.value || undefined) as Shift | undefined })}>
          <option value="">כל המשמרות</option>
          {Object.entries(SHIFT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="inline">מ-<input type="date" onChange={(e) => filter({ fromDate: e.target.value || undefined })} /></label>
        <label className="inline">עד<input type="date" onChange={(e) => filter({ toDate: e.target.value || undefined })} /></label>
        <input placeholder="אימייל לקוח" onBlur={(e) => filter({ email: e.target.value || undefined })} />
        <select value={`${query.sortBy}:${query.sortDir}`} onChange={(e) => {
          const [sortBy, sortDir] = e.target.value.split(':') as [OrderQuery['sortBy'], OrderQuery['sortDir']];
          filter({ sortBy, sortDir });
        }}>
          <option value="eventDate:desc">תאריך אירוע (חדש קודם)</option>
          <option value="eventDate:asc">תאריך אירוע (ישן קודם)</option>
          <option value="createdAt:desc">תאריך הזמנה</option>
          <option value="totalPrice:desc">מחיר (גבוה קודם)</option>
        </select>
      </div>

      {orders.isLoading && <Loading />}
      {/* למשל 400 על טווח תאריכים הפוך, או 409 אם ההזמנה השתנתה בינתיים */}
      <ErrorMessage error={orders.error ?? setStatus.error} />

      {orders.data && (
        <>
          <p className="muted">{orders.data.totalCount} הזמנות {orders.isFetching && '· מעדכן...'}</p>
          <table className="table">
            <thead>
              <tr><th>#</th><th>לקוח</th><th>תאריך</th><th>משמרת</th><th>פריטים</th><th>סה"כ</th><th>סטטוס</th><th /></tr>
            </thead>
            <tbody>
              {orders.data.items.map((o) => (
                <tr key={o.id} className={o.status === 'Cancelled' ? 'row-inactive' : undefined}>
                  <td>{o.id}</td>
                  <td>{o.customerName}<div className="muted">{o.contactPhone}</div></td>
                  <td>{formatDate(o.eventDate)}</td>
                  <td>{SHIFT_LABELS[o.shift]}</td>
                  <td>{o.items.map((i) => `${i.productName} × ${i.quantity}`).join(', ')}</td>
                  <td>{formatPrice(o.totalPrice)}</td>
                  <td><span className="badge">{STATUS_LABELS[o.status]}</span></td>
                  <td><div className="row-actions">
                    {o.status === 'Confirmed' && (
                      <>
                        <button className="btn btn-small" disabled={setStatus.isPending}
                                onClick={() => setStatus.mutate({ id: o.id, status: 'Completed' })}>הושלמה</button>
                        <button className="btn btn-small btn-danger" disabled={setStatus.isPending}
                                onClick={() => setStatus.mutate({ id: o.id, status: 'Cancelled' })}>ביטול</button>
                      </>
                    )}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={orders.data.page} totalPages={orders.data.totalPages}
                      onChange={(page) => setQuery((q) => ({ ...q, page }))} />
        </>
      )}
    </section>
  );
}
