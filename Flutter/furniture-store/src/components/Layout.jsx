import { Link, NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Layout.css';

export default function Layout() {
  const { user, cartCount, wishlist, logout } = useStore();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">Furni<span>Hub</span></Link>
          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Shop</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="header-actions">
            <Link to="/wishlist" className="icon-link" title="Wishlist">
              ♥ {wishlist.length || ''}
            </Link>
            <Link to="/cart" className="icon-link" title="Cart">
              🛒 {cartCount || ''}
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="user-link">{user.name.split(' ')[0]}</Link>
                <button type="button" className="link-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© 2026 FurniHub — Demo furniture store (localStorage persistence)</p>
          <p className="demo-note">Demo login: sujeshkolathur@gmail.com / demo123 · Admin: admin@furniture.com / admin123</p>
        </div>
      </footer>
    </div>
  );
}
