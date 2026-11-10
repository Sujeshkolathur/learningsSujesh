import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { adminStats } = useStore();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-title">Furniture Admin</p>
        <nav>
          <NavLink end to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>
        <div className="admin-mini-stats">
          <p>Products <strong>{adminStats.totalProducts}</strong></p>
          <p>Pending <strong>{adminStats.pendingOrders}</strong></p>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
