import { useState } from 'react';
import type { Product } from '../api/types';
import { useAddToCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { ErrorMessage } from './ErrorMessage';

const API_URL = import.meta.env.VITE_API_URL ?? '';

interface Props {
  product: Product;
  canAddToCart: boolean;
}

export function ProductCard({ product, canAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  // כמה אפשר להזמין: לפי התאריך והמשמרת שנבחרו, ואחרת לפי היחידות התקינות. השרת בודק שוב
  const maxQuantity = product.available ?? Math.max(0, product.totalQuantity - product.outOfServiceQuantity);

  return (
    <article className="card">
      {product.imageUrl
        ? <img src={API_URL + product.imageUrl} alt={product.name} />
        : <div className="img-placeholder">🎪</div>}
      <h3>{product.name}</h3>
      <small className="muted">{product.categoryName}{product.minAge ? ` · מגיל ${product.minAge}` : ''}</small>
      <p>{product.description}</p>
      <div className="prices">
        <span>משמרת: {formatPrice(product.pricePerShift)}</span>
        <span>יום שלם: {formatPrice(product.fullDayPrice)}</span>
      </div>
      {product.available !== null && (
        <div className="available">זמינות בתאריך שנבחר: <b>{product.available}</b></div>
      )}

      {canAddToCart && (
        <div className="add-row">
          <input type="number" min={1} max={maxQuantity} value={quantity} disabled={maxQuantity === 0}
                 onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, Number(e.target.value))))} />
          <button className="btn btn-primary" disabled={addToCart.isPending || maxQuantity === 0}
                  onClick={() => addToCart.mutate({ productId: product.id, quantity })}>
            {addToCart.isPending ? 'מוסיף...' : 'הוספה לסל'}
          </button>
        </div>
      )}
      {canAddToCart && (
        <small className="muted">{maxQuantity === 0 ? 'אין יחידות זמינות' : `במלאי: ${maxQuantity} יחידות`}</small>
      )}
      {addToCart.isSuccess && <small className="success">נוסף לסל ✓</small>}
      <ErrorMessage error={addToCart.error} />
    </article>
  );
}
