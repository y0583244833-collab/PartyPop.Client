import { useForm } from 'react-hook-form';
import type { ProductFormData } from '../../api/endpoints';
import type { Product } from '../../api/types';
import { useCategories } from '../../hooks/useCatalog';
import { FormField } from '../FormField';
import { ErrorMessage } from '../ErrorMessage';

interface Props {
  product?: Product;           // אין → יצירה, יש → עריכה
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isPending: boolean;
  error: unknown;
}

/** טופס אחד ליצירה ולעריכה של מוצר. */
export function ProductForm({ product, onSubmit, onCancel, isPending, error }: Props) {
  const categories = useCategories();
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product
      ? {
          name: product.name, description: product.description, categoryId: product.categoryId,
          pricePerShift: product.pricePerShift, totalQuantity: product.totalQuantity, minAge: product.minAge,
        }
      : { name: '', description: '', pricePerShift: 100, totalQuantity: 1, minAge: null },
  });

  const submit = (data: ProductFormData) =>
    onSubmit({ ...data, minAge: Number.isNaN(data.minAge) ? null : data.minAge });

  return (
    <form className="form-card wide" onSubmit={handleSubmit(submit)} noValidate>
      <h3>{product ? `עריכת "${product.name}"` : 'מוצר חדש'}</h3>
      <div className="form-grid">
        <FormField label="שם" error={errors.name}>
          <input {...register('name', { required: 'שדה חובה', maxLength: { value: 100, message: 'עד 100 תווים' } })} />
        </FormField>
        <FormField label="קטגוריה" error={errors.categoryId}>
          <select {...register('categoryId', { valueAsNumber: true, validate: (v) => v > 0 || 'נא לבחור קטגוריה' })}>
            <option value={0}>בחירה...</option>
            {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="מחיר למשמרת (₪)" error={errors.pricePerShift}>
          <input type="number" step="0.01" {...register('pricePerShift', {
            valueAsNumber: true, required: 'שדה חובה', min: { value: 0.01, message: 'מחיר חייב להיות חיובי' },
          })} />
        </FormField>
        <FormField label="כמות כוללת" error={errors.totalQuantity}>
          <input type="number" {...register('totalQuantity', {
            valueAsNumber: true, required: 'שדה חובה',
            min: { value: 1, message: 'לפחות 1' }, max: { value: 1000, message: 'עד 1000' },
          })} />
        </FormField>
        <FormField label="גיל מינימלי (רשות)" error={errors.minAge}>
          <input type="number" {...register('minAge', {
            valueAsNumber: true, min: { value: 0, message: '0 ומעלה' }, max: { value: 120, message: 'עד 120' },
          })} />
        </FormField>
      </div>
      <FormField label="תיאור" error={errors.description}>
        <textarea rows={2} {...register('description', { maxLength: { value: 1000, message: 'עד 1000 תווים' } })} />
      </FormField>
      <ErrorMessage error={error} />
      <div className="actions">
        <button className="btn btn-primary" disabled={isPending}>{isPending ? 'שומר...' : 'שמירה'}</button>
        <button type="button" className="btn" onClick={onCancel}>ביטול</button>
      </div>
    </form>
  );
}
