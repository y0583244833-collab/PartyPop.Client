import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCart';
import { FormField } from '../FormField';
import { ErrorMessage } from '../ErrorMessage';

interface CheckoutData {
  eventAddress: string;
  contactPhone: string;
}

/**
 * אישור הזמנה: הפעולה על המשאב המוגבל.
 * 201 → מעבר להזמנות שלי. 409 → ConflictAlert מציג מה נתפס (דרך ErrorMessage).
 */
export function CheckoutForm({ disabled }: { disabled: boolean }) {
  const checkout = useCheckout();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<CheckoutData>();

  const submit = (data: CheckoutData) =>
    checkout.mutate(data, { onSuccess: (order) => navigate('/orders', { state: { createdId: order.id } }) });

  return (
    <form className="form-card" onSubmit={handleSubmit(submit)} noValidate>
      <h3>אישור הזמנה</h3>
      <FormField label="כתובת האירוע" error={errors.eventAddress}>
        <input {...register('eventAddress', {
          required: 'נא להזין כתובת',
          maxLength: { value: 200, message: 'עד 200 תווים' },
        })} />
      </FormField>
      <FormField label="טלפון ליצירת קשר" error={errors.contactPhone}>
        <input {...register('contactPhone', {
          required: 'נא להזין טלפון',
          pattern: { value: /^0\d{8,9}$/, message: 'טלפון לא תקין' },
        })} />
      </FormField>

      {/* כאן מוצג ה-409: "המשאב נתפס" */}
      <ErrorMessage error={checkout.error} onRetry={() => submit(getValues())} />

      <button className="btn btn-primary" disabled={disabled || checkout.isPending}>
        {checkout.isPending ? 'שולח...' : 'אישור הזמנה'}
      </button>
    </form>
  );
}
