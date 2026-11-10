import { Link, useLocation, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { deliveryDate, formatCurrency } from '../utils/format';
import './Checkout.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const { orders, notifications } = useStore();
  const order = location.state?.order || orders.find((o) => o.id === orderId);
  const emailNotif = notifications.find((n) => n.orderId === order?.id && n.type === 'email');

  if (!order) {
    return (
      <div className="container section">
        <p>Order not found.</p>
        <Link to="/orders">View orders</Link>
      </div>
    );
  }

  const whatsappText = encodeURIComponent(
    `Hello ${order.customerName} 👋\n\nYour order #${order.orderNumber} has been confirmed.\n\nAmount: ₹${order.amount.toLocaleString('en-IN')}\n\nExpected Delivery: ${deliveryDate(5)}\n\nThank you.`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <div className="container section confirmation-page">
      <div className="card confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Order placed successfully!</h1>
        <p>Order number: <strong>#{order.orderNumber}</strong></p>
        <p>Total: <strong>{formatCurrency(order.amount)}</strong></p>
        <p>Expected delivery: <strong>{deliveryDate(5)}</strong></p>

        <div className="order-items-list">
          <h3>Items</h3>
          {order.items.map((item) => (
            <p key={item.productId}>{item.name} × {item.qty} — {formatCurrency(item.price * item.qty)}</p>
          ))}
        </div>

        {emailNotif && (
          <div className="email-preview">
            <h3>📧 Email notification (demo)</h3>
            <p><strong>Subject:</strong> {emailNotif.subject}</p>
            <pre>{emailNotif.body}</pre>
          </div>
        )}

        <div className="confirmation-actions">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Share on WhatsApp
          </a>
          <Link to="/orders" className="btn">View order history</Link>
          <Link to="/products" className="btn btn-ghost">Continue shopping</Link>
        </div>

        <p className="demo-hint">Stock was reduced automatically. Admin can see this order in the dashboard.</p>
      </div>
    </div>
  );
}
