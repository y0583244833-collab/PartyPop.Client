import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const isCustomer = user?.role === 'Customer';
  const isAdmin = user?.role === 'Admin';

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="logo">🎈 PartyPop</NavLink>
        <nav>
          <NavLink to="/">קטלוג</NavLink>
          {isCustomer && <NavLink to="/cart">הסל שלי</NavLink>}
          {isCustomer && <NavLink to="/orders">ההזמנות שלי</NavLink>}
          {isAdmin && <NavLink to="/admin/products">ניהול מוצרים</NavLink>}
          {isAdmin && <NavLink to="/admin/categories">קטגוריות</NavLink>}
          {isAdmin && <NavLink to="/admin/orders">הזמנות</NavLink>}
        </nav>
        <div className="user-box">
          {user ? (
            <>
              <span>שלום, {user.firstName}{isAdmin && ' (מנהל)'}</span>
              <button className="btn btn-link" onClick={logout}>התנתקות</button>
            </>
          ) : (
            <>
              <NavLink to="/login">התחברות</NavLink>
              <NavLink to="/register">הרשמה</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
