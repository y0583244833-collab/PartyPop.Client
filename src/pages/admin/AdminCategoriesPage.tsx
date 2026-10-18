import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminApi, type CategoryFormData } from '../../api/endpoints';
import type { Category } from '../../api/types';
import { useCategories } from '../../hooks/useCatalog';
import { useAdminMutation } from '../../hooks/useAdmin';
import { FormField } from '../../components/FormField';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';

const KEYS = [['categories'], ['products']];

/** טופס קטגוריה: משמש גם להוספה וגם לעריכה בשורה. */
function CategoryForm({ category, onDone }: { category?: Category; onDone: () => void }) {
  const save = useAdminMutation(
    (data: CategoryFormData) => (category ? adminApi.updateCategory(category.id, data) : adminApi.createCategory(data)),
    KEYS,
  );
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    defaultValues: { name: category?.name ?? '', description: category?.description ?? '' },
  });

  const submit = (data: CategoryFormData) =>
    save.mutate(data, { onSuccess: () => { reset(); onDone(); } });

  return (
    <form className="inline-form" onSubmit={handleSubmit(submit)} noValidate>
      <FormField label="שם" error={errors.name}>
        <input {...register('name', { required: 'שדה חובה', maxLength: { value: 50, message: 'עד 50 תווים' } })} />
      </FormField>
      <FormField label="תיאור" error={errors.description}>
        <input {...register('description', { maxLength: { value: 500, message: 'עד 500 תווים' } })} />
      </FormField>
      <button className="btn btn-primary" disabled={save.isPending}>{category ? 'שמירה' : 'הוספה'}</button>
      {category && <button type="button" className="btn" onClick={onDone}>ביטול</button>}
      {/* 409: שם קיים */}
      <ErrorMessage error={save.error} />
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const remove = useAdminMutation(() => adminApi.deleteCategory(category.id), KEYS);

  if (editing) return <li><CategoryForm category={category} onDone={() => setEditing(false)} /></li>;
  return (
    <li className="category-row">
      <div><b>{category.name}</b> <span className="muted">{category.description}</span></div>
      <div className="row-actions">
        <button className="btn btn-small" onClick={() => setEditing(true)}>עריכה</button>
        <button className="btn btn-small btn-danger" disabled={remove.isPending} onClick={() => remove.mutate(undefined)}>
          מחיקה
        </button>
      </div>
      {/* 409: יש בקטגוריה מוצרים */}
      <ErrorMessage error={remove.error} />
    </li>
  );
}

export function AdminCategoriesPage() {
  const categories = useCategories();

  return (
    <section>
      <h2>קטגוריות</h2>
      <CategoryForm onDone={() => undefined} />
      {categories.isLoading && <Loading />}
      <ErrorMessage error={categories.error} />
      <ul className="list">
        {categories.data?.map((c) => <CategoryRow key={c.id} category={c} />)}
      </ul>
    </section>
  );
}
