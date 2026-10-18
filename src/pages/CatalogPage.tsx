import { useState } from 'react';
import { useCategories, useProducts } from '../hooks/useCatalog';
import { useAuth } from '../context/AuthContext';
import type { ProductQuery } from '../api/endpoints';
import { SHIFT_LABELS, type Shift } from '../api/types';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

const PAGE_SIZE = 6;

export function CatalogPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState<ProductQuery>({ page: 1, pageSize: PAGE_SIZE, sortBy: 'name' });
  const categories = useCategories();
  const products = useProducts(query);

  // כל שינוי בסינון מחזיר לעמוד 1
  const updateFilter = (changes: Partial<ProductQuery>) => setQuery((q) => ({ ...q, ...changes, page: 1 }));

  return (
    <section>
      <h2>קטלוג</h2>

      <div className="filters">
        <input placeholder="חיפוש..." onChange={(e) => updateFilter({ search: e.target.value || undefined })} />
        <select onChange={(e) => updateFilter({ categoryId: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">כל הקטגוריות</option>
          {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" onChange={(e) => updateFilter({ date: e.target.value || undefined })} />
        <select onChange={(e) => updateFilter({ shift: (e.target.value || undefined) as Shift | undefined })}>
          <option value="">משמרת</option>
          {Object.entries(SHIFT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={query.sortBy} onChange={(e) => updateFilter({ sortBy: e.target.value as 'name' | 'price' })}>
          <option value="name">מיון לפי שם</option>
          <option value="price">מיון לפי מחיר</option>
        </select>
      </div>
      {query.date && !query.shift && <small className="muted">כדי לסנן לפי זמינות יש לבחור גם משמרת</small>}

      {products.isLoading && <Loading />}
      <ErrorMessage error={products.error} />

      {products.data && (
        <>
          <p className="muted">נמצאו {products.data.totalCount} מוצרים {products.isFetching && '· מעדכן...'}</p>
          <div className="grid">
            {products.data.items.map((p) => (
              <ProductCard key={p.id} product={p} canAddToCart={user?.role === 'Customer'} />
            ))}
          </div>
          <Pagination page={products.data.page} totalPages={products.data.totalPages}
                      onChange={(page) => setQuery((q) => ({ ...q, page }))} />
        </>
      )}
    </section>
  );
}
