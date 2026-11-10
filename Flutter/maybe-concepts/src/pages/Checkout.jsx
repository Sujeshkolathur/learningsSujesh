import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export default function Checkout() {
  const navigate = useNavigate();
  const { product, cartLine, cartTotal, clearCart, user } = useStore();
  const [form, setForm] = useState({
    email: user?.email || '',
    name: '',
    address: '',
    city: '',
    pincode: '',
    payment: 'upi',
  });

  if (!cartLine) {
    return (
      <div className="page-narrow">
        <p>Cart is empty.</p>
        <Link to="/">Shop</Link>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const order = {
      id: `MB-${Date.now()}`,
      ...form,
      items: [{ name: product.name, qty: cartLine.quantity, price: product.price }],
      total: cartTotal,
      at: new Date().toISOString(),
    };
    const orders = JSON.parse(localStorage.getItem('maybe_be_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('maybe_be_orders', JSON.stringify(orders));
    clearCart();
    navigate('/order-success', { state: { order } });
  }

  return (
    <div className="page-narrow checkout-page">
      <h1>Check out</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="field-row">
          <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input required placeholder="PIN" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        </div>

        <fieldset className="payment-fieldset">
          <legend>Payment</legend>
          <label><input type="radio" name="pay" checked={form.payment === 'upi'} onChange={() => setForm({ ...form, payment: 'upi' })} /> UPI / Card (demo)</label>
          <label><input type="radio" name="pay" checked={form.payment === 'cod'} onChange={() => setForm({ ...form, payment: 'cod' })} /> Cash on delivery</label>
        </fieldset>

        <div className="checkout-summary">
          <p>{product.name} × {cartLine.quantity}</p>
          <p><strong>Total {formatINR(cartTotal)}</strong></p>
        </div>

        <button type="submit" className="btn btn-full">Complete order (demo)</button>
      </form>
    </div>
  );
}
