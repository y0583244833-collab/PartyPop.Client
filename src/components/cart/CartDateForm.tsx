import { useForm } from 'react-hook-form';
import { SHIFT_LABELS, type Cart, type Shift } from '../../api/types';
import { useSetCartDate } from '../../hooks/useCart';
import { tomorrow } from '../../utils/format';
import { FormField } from '../FormField';
import { ErrorMessage } from '../ErrorMessage';

interface DateForm {
  eventDate: string;
  shift: Shift;
}

/** תאריך ומשמרת אחת לכל הסל ("יום כיף" אחד). */
export function CartDateForm({ cart }: { cart: Cart }) {
  const setDate = useSetCartDate();
  const { register, handleSubmit, formState: { errors } } = useForm<DateForm>({
    values: { eventDate: cart.eventDate ?? '', shift: cart.shift ?? 'Morning' },
  });

  return (
    <form className="inline-form" onSubmit={handleSubmit((d) => setDate.mutate(d))} noValidate>
      <FormField label="תאריך האירוע" error={errors.eventDate}>
        <input type="date" min={tomorrow()} {...register('eventDate', { required: 'נא לבחור תאריך' })} />
      </FormField>
      <FormField label="משמרת" error={errors.shift}>
        <select {...register('shift', { required: true })}>
          {Object.entries(SHIFT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </FormField>
      <button className="btn" disabled={setDate.isPending}>{setDate.isPending ? 'שומר...' : 'שמירה'}</button>
      <ErrorMessage error={setDate.error} />
    </form>
  );
}
