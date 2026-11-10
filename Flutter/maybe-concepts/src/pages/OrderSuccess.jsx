import { Link, useLocation } from 'react-router-dom';
import { formatINR } from '../utils/format';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="page-narrow">
        <p>No order found.</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  const whatsapp = encodeURIComponent(
    `Hello 👋\n\nYour order ${order.id} has been confirmed.\n\nAmount: ${formatINR(order.total)}\n\nThank you.`
  );

  return (
    <div className="page-narrow order-success">
      <h1>Order placed</h1>
      <p>Order <strong>{order.id}</strong></p>
      <p>Total: <strong>{formatINR(order.total)}</strong></p>
      <p className="muted">Demo mode — saved in localStorage only.</p>
      <a href={`https://wa.me/?text=${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn">
        Share on WhatsApp
      </a>
      <Link to="/" className="text-link">Continue shopping</Link>
    </div>
  );
}
