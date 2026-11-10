import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, product, cartLine, updateQty } = useStore();

  if (!cartOpen) return null;

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Item added to your cart">
      <button type="button" className="cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close" />
      <aside className="cart-drawer">
        <div className="cart-drawer-head">
          <h2>✓ Item added to your cart</h2>
          <button type="button" className="close-btn" onClick={() => setCartOpen(false)} aria-label="Close">×</button>
        </div>

        {cartLine ? (
          <>
            <div className="cart-line">
              <img src={product.images[0]} alt="" />
              <div>
                <p className="line-name">{product.name}</p>
                <p className="line-price">{formatINR(product.price)}</p>
                <p className="line-qty">Qty: {cartLine.quantity}</p>
              </div>
            </div>
            <div className="cart-drawer-actions">
              <Link to="/cart" className="button button--secondary button--full-width" onClick={() => setCartOpen(false)}>
                View cart
              </Link>
              <Link to="/checkout" className="button button--primary button--full-width" onClick={() => setCartOpen(false)}>
                Check out
              </Link>
            </div>
            <button type="button" className="continue-link" onClick={() => setCartOpen(false)}>
              Continue shopping
            </button>
          </>
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </aside>
    </div>
  );
}
