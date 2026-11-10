import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';

export default function CartPage() {
  const { product, cartLine, cartTotal, updateQty, clearCart } = useStore();

  if (!cartLine) {
    return (
      <div className="page-narrow">
        <h1>Cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <h1>Cart</h1>
      <div className="cart-page-item">
        <img src={product.images[0]} alt="" />
        <div>
          <h2>{product.name}</h2>
          <p>{formatINR(product.price)}</p>
          <div className="qty-control">
            <button type="button" onClick={() => updateQty(cartLine.quantity - 1)}>−</button>
            <span>{cartLine.quantity}</span>
            <button type="button" onClick={() => updateQty(cartLine.quantity + 1)}>+</button>
          </div>
        </div>
        <p className="line-total">{formatINR(cartTotal)}</p>
      </div>
      <div className="cart-page-footer">
        <p><strong>Subtotal</strong> {formatINR(cartTotal)}</p>
        <Link to="/checkout" className="btn btn-full">Check out</Link>
        <button type="button" className="text-btn" onClick={clearCart}>Clear cart</button>
      </div>
    </div>
  );
}
