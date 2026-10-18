// הטיפוסים תואמים ל-DTOs של השרת (PartyPop.Core/DTOs)

export type Shift = 'Morning' | 'AfternoonEvening' | 'FullDay';
export type Role = 'Customer' | 'Admin';

export const SHIFT_LABELS: Record<Shift, string> = {
  Morning: 'בוקר (08:00–14:00)',
  AfternoonEvening: 'צהריים-ערב (14:00–20:00)',
  FullDay: 'יום שלם',
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  pricePerShift: number;
  fullDayPrice: number;
  totalQuantity: number;
  outOfServiceQuantity: number;
  imageUrl: string | null;
  minAge: number | null;
  status: 'Active' | 'Inactive';
  available: number | null;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  available: number | null;
  warning: string | null;
}

export interface Cart {
  eventDate: string | null;
  shift: Shift | null;
  items: CartItem[];
  estimatedTotal: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'Confirmed' | 'Cancelled' | 'Completed';

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  contactPhone: string;
  createdAt: string;
  eventDate: string;
  shift: Shift;
  eventAddress: string;
  totalPrice: number;
  status: OrderStatus;
  notes: string | null;
  items: OrderItem[];
}

/** פריט שלא זמין: מגיע מהשרת בתשובת 409 של אישור הזמנה. */
export interface UnavailableItem {
  cartItemId: number;
  productName: string;
  requested: number;
  available: number;
}

/** ה-JSON האחיד של שגיאות מהשרת (ExceptionHandlingMiddleware). */
export interface ErrorBody {
  status: number;
  message: string;
  correlationId?: string;
  errors?: Record<string, string[]>;
  unavailableItems?: UnavailableItem[];
}
