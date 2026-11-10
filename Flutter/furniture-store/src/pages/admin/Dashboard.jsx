import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminDashboard() {
  const { adminStats, products, orders } = useStore();
  const recentOrders = orders.slice(0, 5);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div>
      <h1 className="page-title">Furniture Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Products</span>
          <strong>{adminStats.totalProducts}</strong>
        </div>
        <div className="stat-card">
          <span>Orders Today</span>
          <strong>{adminStats.ordersToday}</strong>
        </div>
        <div className="stat-card">
          <span>Revenue Today</span>
          <strong>{formatCurrency(adminStats.revenueToday)}</strong>
        </div>
        <div className="stat-card">
          <span>Pending Orders</span>
          <strong>{adminStats.pendingOrders}</strong>
        </div>
        <div className="stat-card warn">
          <span>Out of Stock</span>
          <strong>{adminStats.outOfStock}</strong>
        </div>
      </div>

      <div className="admin-panels">
        <section className="card">
          <h2>Recent orders</h2>
          {!recentOrders.length ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td>{formatCurrency(o.amount)}</td>
                    <td>{o.status}</td>
                    <td>{formatDate(o.createdDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2>Inventory alerts</h2>
          <h3 className="sub">Out of stock</h3>
          {outOfStock.length ? (
            <ul className="inventory-list">
              {outOfStock.map((p) => (
                <li key={p.id}>{p.name} — <strong>0</strong></li>
              ))}
            </ul>
          ) : (
            <p className="muted">All products in stock.</p>
          )}
          <h3 className="sub">Low stock (≤5)</h3>
          {lowStock.length ? (
            <ul className="inventory-list">
              {lowStock.map((p) => (
                <li key={p.id}>{p.name} — Available: <strong>{p.stock}</strong></li>
              ))}
            </ul>
          ) : (
            <p className="muted">No low-stock items.</p>
          )}
        </section>
      </div>
    </div>
  );
}
