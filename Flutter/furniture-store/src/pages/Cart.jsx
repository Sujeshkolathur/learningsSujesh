import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';

export default function Cart() {
  const { cartDetails, cartTotal, updateCartQty, removeFromCart } = useStore();

  if (!cartDetails.length) {
    return (
      <div className="container section">
        <h1 className="section-title">Your cart</h1>
        <p className="empty-msg">Your cart is empty.</p>
        <Link to="/products" className="btn">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">Your cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartDetails.map((item) => (
            <article key={item.productId} className="cart-item">
              <img src={item.product.images[0]} alt={item.product.name} />
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p>{formatCurrency(item.product.price)}</p>
                <p className="stock-hint">Stock: {item.product.stock}</p>
              </div>
              <div className="cart-item-qty">
                <button type="button" onClick={() => updateCartQty(item.productId, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartQty(item.productId, Math.min(item.product.stock, item.quantity + 1))}
                >+</button>
              </div>
              <p className="cart-item-total">{formatCurrency(item.product.price * item.quantity)}</p>
              <button type="button" className="link-btn" onClick={() => removeFromCart(item.productId)}>Remove</button>
            </article>
          ))}
        </div>
        <aside className="cart-summary card">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{cartTotal >= 10000 ? 'Free' : formatCurrency(499)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatCurrency(cartTotal + (cartTotal >= 10000 ? 0 : 499))}</span>
          </div>
          <Link to="/checkout" className="btn btn-full">Proceed to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
