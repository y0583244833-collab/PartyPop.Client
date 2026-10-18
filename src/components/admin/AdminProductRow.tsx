import { useState } from 'react';
import { adminApi } from '../../api/endpoints';
import type { Product } from '../../api/types';
import { useAdminMutation } from '../../hooks/useAdmin';
import { formatPrice } from '../../utils/format';
import { ErrorMessage } from '../ErrorMessage';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const PRODUCTS = [['products']];

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
}

/** שורה בטבלת המוצרים: יחידות בתיקון, תמונה, השבתה/החזרה. */
export function AdminProductRow({ product, onEdit }: Props) {
  const [outOfService, setOutOfService] = useState(product.outOfServiceQuantity);
  const setOos = useAdminMutation((qty: number) => adminApi.setOutOfService(product.id, qty), PRODUCTS);
  const upload = useAdminMutation((file: File) => adminApi.uploadImage(product.id, file), PRODUCTS);
  const toggle = useAdminMutation(
    () => (product.status === 'Active' ? adminApi.deactivateProduct(product.id) : adminApi.activateProduct(product.id)),
    PRODUCTS,
  );
  const inactive = product.status === 'Inactive';

  return (
    <>
      <tr className={inactive ? 'row-inactive' : undefined}>
        <td>
          {product.imageUrl
            ? <img className="thumb" src={API_URL + product.imageUrl} alt="" />
            : <span className="thumb">🎪</span>}
        </td>
        <td>
          <b>{product.name}</b>
          <div className="muted">{product.categoryName}</div>
        </td>
        <td>{formatPrice(product.pricePerShift)}</td>
        <td>{product.totalQuantity}</td>
        <td>
          <div className="inline">
            <input type="number" min={0} max={product.totalQuantity} value={outOfService}
                   onChange={(e) => setOutOfService(Number(e.target.value))} />
            {outOfService !== product.outOfServiceQuantity && (
              <button className="btn btn-small" disabled={setOos.isPending} onClick={() => setOos.mutate(outOfService)}>
                עדכון
              </button>
            )}
          </div>
        </td>
        <td><span className={`badge ${inactive ? 'badge-off' : ''}`}>{inactive ? 'מושבת' : 'פעיל'}</span></td>
        <td><div className="row-actions">
          <button className="btn btn-small" onClick={() => onEdit(product)}>עריכה</button>
          <label className="btn btn-small">
            {upload.isPending ? 'מעלה...' : 'תמונה'}
            <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden
                   onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])} />
          </label>
          <button className={`btn btn-small ${inactive ? '' : 'btn-danger'}`} disabled={toggle.isPending}
                  onClick={() => toggle.mutate(undefined)}>
            {inactive ? 'החזרה לקטלוג' : 'השבתה'}
          </button>
        </div></td>
      </tr>
      {(setOos.error || upload.error || toggle.error) && (
        <tr><td colSpan={7}><ErrorMessage error={setOos.error ?? upload.error ?? toggle.error} /></td></tr>
      )}
    </>
  );
}
