import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUSES = ['PENDING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <h1 className="page-title">Order management</h1>

      {!orders.length ? (
        <div className="card"><p className="muted">No orders yet. Place an order from the shop to see it here.</p></div>
      ) : (
        <div className="orders-admin-list">
          {orders.map((order) => (
            <article key={order.id} className="card order-admin-card">
              <div className="order-admin-head">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p>{order.customerName} · {order.customerEmail} · {formatDate(order.createdDate)}</p>
                  <p>Payment: {order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>
                </div>
                <div className="order-admin-total">{formatCurrency(order.amount)}</div>
              </div>

              <div className="order-admin-items">
                {order.items.map((item) => (
                  <span key={item.productId}>{item.name} × {item.qty}</span>
                ))}
              </div>

              <div className="status-controls">
                <label>
                  Status:
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="input"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
