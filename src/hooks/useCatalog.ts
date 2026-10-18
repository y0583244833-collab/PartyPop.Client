import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { catalogApi, type ProductQuery } from '../api/endpoints';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: catalogApi.categories, staleTime: 5 * 60_000 });
}

/** הדפדוף נעשה בשרת. keepPreviousData: העמוד הקודם נשאר על המסך עד שהבא מגיע. */
export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => catalogApi.products(query),
    placeholderData: keepPreviousData,
  });
}
