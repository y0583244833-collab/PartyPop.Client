# PartyPop Client (React)

React + TypeScript · React Router · React Hook Form · React Query (TanStack) · Context

## הרצה
```powershell
npm install
npm run dev
```
נפתח ב-http://localhost:5173. השרת צריך לרוץ (`dotnet run --project PartyPop.API --launch-profile https`).
כתובת השרת מוגדרת בקובץ `.env` (`VITE_API_URL`).

## מבנה
```
src/
  api/          client.ts (fetch אחיד + Token + ApiError), endpoints.ts, types.ts
  context/      AuthContext (המשתמש המחובר, שמירת ה-JWT)
  hooks/        useCatalog, useCart, useOrders, useAdmin (React Query)
  components/   Layout, ProtectedRoute, Pagination, Loading, FormField,
                ErrorMessage, ConflictAlert (409), ProductCard, cart/*, admin/*
  pages/        Login, Register, Catalog, Cart, Orders
  pages/admin/  AdminProducts, AdminCategories, AdminOrders (מנהל בלבד)
```
