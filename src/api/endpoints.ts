import { api } from './client';
import type { AuthResponse, Cart, CartItem, Category, Order, OrderStatus, PagedResult, Product, Shift, User } from './types';

// כל ה-endpoints במקום אחד. הקומפוננטות לא מכירות כתובות URL

export interface ProductQuery {
  page: number;
  pageSize: number;
  categoryId?: number;
  search?: string;
  date?: string;
  shift?: Shift;
  sortBy?: 'name' | 'price';
  sortDir?: 'asc' | 'desc';
  includeInactive?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/api/auth/tokens', { method: 'POST', body: { email, password } }),
  register: (data: RegisterData) => api<User>('/api/users', { method: 'POST', body: data }),
  me: () => api<User>('/api/users/me'),
};

export const catalogApi = {
  categories: () => api<Category[]>('/api/categories'),
  products: (q: ProductQuery) => api<PagedResult<Product>>('/api/products', { query: { ...q } }),
};

export const cartApi = {
  get: () => api<Cart>('/api/carts/me'),
  setDate: (eventDate: string, shift: Shift) =>
    api<void>('/api/carts/me', { method: 'PUT', body: { eventDate, shift } }),
  addItem: (productId: number, quantity: number) =>
    api<CartItem>('/api/carts/me/items', { method: 'POST', body: { productId, quantity } }),
  updateItem: (itemId: number, quantity: number) =>
    api<void>(`/api/carts/me/items/${itemId}`, { method: 'PUT', body: { quantity } }),
  removeItem: (itemId: number) => api<void>(`/api/carts/me/items/${itemId}`, { method: 'DELETE' }),
};

export const ordersApi = {
  checkout: (eventAddress: string, contactPhone: string) =>
    api<Order>('/api/orders', { method: 'POST', body: { eventAddress, contactPhone } }),
  mine: () => api<Order[]>('/api/orders/me'),
  cancel: (id: number) => api<void>(`/api/orders/${id}/status`, { method: 'PATCH', body: { status: 'Cancelled' } }),
};

// ================= מנהל =================

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: number;
  pricePerShift: number;
  totalQuantity: number;
  minAge: number | null;
}

export interface CategoryFormData {
  name: string;
  description: string | null;
}

export interface OrderQuery {
  page: number;
  pageSize: number;
  status?: OrderStatus;
  shift?: Shift;
  fromDate?: string;
  toDate?: string;
  email?: string;
  sortBy?: 'eventDate' | 'createdAt' | 'totalPrice';
  sortDir?: 'asc' | 'desc';
}

export const adminApi = {
  createProduct: (data: ProductFormData) => api<Product>('/api/products', { method: 'POST', body: data }),
  updateProduct: (id: number, data: ProductFormData) => api<void>(`/api/products/${id}`, { method: 'PUT', body: data }),
  setOutOfService: (id: number, outOfServiceQuantity: number) =>
    api<void>(`/api/products/${id}/out-of-service`, { method: 'PATCH', body: { outOfServiceQuantity } }),
  deactivateProduct: (id: number) => api<void>(`/api/products/${id}`, { method: 'DELETE' }),
  activateProduct: (id: number) => api<void>(`/api/products/${id}/activate`, { method: 'PATCH' }),
  uploadImage: (id: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api<{ imageUrl: string }>(`/api/products/${id}/image`, { method: 'POST', form });
  },

  createCategory: (data: CategoryFormData) => api<Category>('/api/categories', { method: 'POST', body: data }),
  updateCategory: (id: number, data: CategoryFormData) => api<void>(`/api/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id: number) => api<void>(`/api/categories/${id}`, { method: 'DELETE' }),

  orders: (q: OrderQuery) => api<PagedResult<Order>>('/api/orders', { query: { ...q } }),
  setOrderStatus: (id: number, status: 'Cancelled' | 'Completed') =>
    api<void>(`/api/orders/${id}/status`, { method: 'PATCH', body: { status } }),
};
