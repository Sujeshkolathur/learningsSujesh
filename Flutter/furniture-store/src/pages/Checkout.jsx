import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay (Demo)', desc: 'Simulated online payment' },
  { id: 'upi', label: 'UPI QR (Demo)', desc: 'Scan & pay — demo mode' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user, cartDetails, cartTotal, placeOrder } = useStore();
  const [payment, setPayment] = useState('razorpay');
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
  });
  const [processing, setProcessing] = useState(false);

  const delivery = cartTotal >= 10000 ? 0 : 499;
  const total = cartTotal + delivery;

  if (!user) {
    return (
      <div className="container section">
        <p>Please <a href="/login">login</a> to checkout.</p>
      </div>
    );
  }

  if (!cartDetails.length) {
    navigate('/cart');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);

    if (payment === 'razorpay') {
      await new Promise((r) => setTimeout(r, 1200));
    }

    const result = placeOrder({
      paymentMethod: payment,
      address: { ...address, name: user.name },
    });

    setProcessing(false);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    navigate(`/order-confirmation/${result.order.id}`, { state: { order: result.order } });
  }

  return (
    <div className="container section checkout-page">
      <h1 className="section-title">Checkout</h1>
      <form className="checkout-grid" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <section className="card">
            <h2>Delivery address</h2>
            <input className="input" required placeholder="Address line" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            <div className="field-row">
              <input className="input" required placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input className="input" required placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
            <div className="field-row">
              <input className="input" required placeholder="PIN code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              <input className="input" required placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
          </section>

          <section className="card">
            <h2>Payment method</h2>
            {PAYMENT_METHODS.map((m) => (
              <label key={m.id} className={`payment-option ${payment === m.id ? 'active' : ''}`}>
                <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} />
                <div>
                  <strong>{m.label}</strong>
                  <span>{m.desc}</span>
                </div>
              </label>
            ))}
            {payment === 'upi' && (
              <div className="upi-demo">
                <div className="qr-placeholder">UPI QR (Demo)</div>
                <p>Scan with any UPI app — demo only, no real charge.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="card checkout-summary">
          <h2>Order summary</h2>
          {cartDetails.map((item) => (
            <div key={item.productId} className="summary-item">
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>{delivery ? formatCurrency(delivery) : 'Free'}</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatCurrency(total)}</span></div>
          <button type="submit" className="btn btn-full" disabled={processing}>
            {processing ? 'Processing...' : payment === 'cod' ? 'Place order (COD)' : 'Pay & place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
