import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { CartDateForm } from '../components/cart/CartDateForm';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CheckoutForm } from '../components/cart/CheckoutForm';
import { formatPrice } from '../utils/format';

export function CartPage() {
  const cart = useCart();

  if (cart.isLoading) return <Loading />;
  if (cart.error) return <ErrorMessage error={cart.error} />;
  const data = cart.data!;
  const hasDate = Boolean(data.eventDate && data.shift);

  return (
    <section>
      <h2>הסל שלי</h2>
      <CartDateForm cart={data} />

      {data.items.length === 0 ? (
        <p>הסל ריק. <Link to="/">לקטלוג</Link></p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr><th>מוצר</th><th>כמות</th><th>זמין</th><th>מחיר</th><th /></tr>
            </thead>
            <tbody>
              {data.items.map((item) => <CartItemRow key={item.id} item={item} />)}
            </tbody>
          </table>
          <p className="total">סה"כ משוער: <b>{formatPrice(data.estimatedTotal)}</b></p>
          {!hasDate && <p className="warning">יש לבחור תאריך ומשמרת לפני אישור ההזמנה</p>}
          <CheckoutForm disabled={!hasDate} />
        </>
      )}
    </section>
  );
}
