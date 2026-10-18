import { useState } from 'react';
import { adminApi, type ProductFormData, type ProductQuery } from '../../api/endpoints';
import type { Product } from '../../api/types';
import { useProducts } from '../../hooks/useCatalog';
import { useAdminMutation } from '../../hooks/useAdmin';
import { ProductForm } from '../../components/admin/ProductForm';
import { AdminProductRow } from '../../components/admin/AdminProductRow';
import { Pagination } from '../../components/Pagination';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';

const PRODUCTS = [['products']];

export function AdminProductsPage() {
  const [query, setQuery] = useState<ProductQuery>({ page: 1, pageSize: 10, sortBy: 'name', includeInactive: true });
  // undefined = הטופס סגור, null = מוצר חדש, Product = עריכה
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const products = useProducts(query);

  const save = useAdminMutation(
    (data: ProductFormData) => (editing ? adminApi.updateProduct(editing.id, data) : adminApi.createProduct(data)),
    PRODUCTS,
  );

  const submit = (data: ProductFormData) => save.mutate(data, { onSuccess: () => setEditing(undefined) });
  const openForm = (product: Product | null) => {
    save.reset();
    setEditing(product);
  };

  return (
    <section>
      <div className="page-header">
        <h2>ניהול מוצרים</h2>
        <button className="btn btn-primary" onClick={() => openForm(null)}>+ מוצר חדש</button>
      </div>

      {editing !== undefined && (
        <ProductForm key={editing?.id ?? 'new'} product={editing ?? undefined} onSubmit={submit}
                     onCancel={() => setEditing(undefined)} isPending={save.isPending} error={save.error} />
      )}

      <div className="filters">
        <input placeholder="חיפוש..." onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value || undefined, page: 1 }))} />
        <label className="inline">
          <input type="checkbox" checked={query.includeInactive}
                 onChange={(e) => setQuery((q) => ({ ...q, includeInactive: e.target.checked, page: 1 }))} />
          להציג גם מושבתים
        </label>
      </div>

      {products.isLoading && <Loading />}
      <ErrorMessage error={products.error} />
      {products.data && (
        <>
          <table className="table">
            <thead>
              <tr><th /><th>מוצר</th><th>מחיר</th><th>כמות</th><th>בתיקון</th><th>סטטוס</th><th /></tr>
            </thead>
            <tbody>
              {products.data.items.map((p) => <AdminProductRow key={p.id} product={p} onEdit={openForm} />)}
            </tbody>
          </table>
          <Pagination page={products.data.page} totalPages={products.data.totalPages}
                      onChange={(page) => setQuery((q) => ({ ...q, page }))} />
        </>
      )}
    </section>
  );
}
