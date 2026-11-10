import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/format';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  PACKED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};

export default function Orders() {
  const { user, orders } = useStore();
  const myOrders = orders.filter((o) => o.userId === user?.id);

  if (!user) {
    return (
      <div className="container section">
        <p>Please <Link to="/login">login</Link> to view orders.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">Order history</h1>
      {!myOrders.length ? (
        <p className="empty-msg">No orders yet. <Link to="/products">Start shopping</Link></p>
      ) : (
        <div className="orders-list">
          {myOrders.map((order) => (
            <article key={order.id} className="card order-card">
              <div className="order-head">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p>{formatDate(order.createdDate)} · {order.paymentMethod.toUpperCase()}</p>
                </div>
                <span className="status-badge" style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <p key={item.productId}>{item.name} × {item.qty}</p>
                ))}
              </div>
              <p className="order-total">Total: {formatCurrency(order.amount)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
