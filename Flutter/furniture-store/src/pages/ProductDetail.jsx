import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, user } = useStore();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="container section">
        <p>Product not found.</p>
        <Link to="/products">Back to shop</Link>
      </div>
    );
  }

  function handleAdd() {
    const result = addToCart(product.id, qty);
    if (!result.ok) alert(result.message);
    else alert('Added to cart!');
  }

  function handleBuyNow() {
    const result = addToCart(product.id, qty);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="container section product-detail">
      <div className="detail-grid">
        <div className="gallery">
          <img src={product.images[activeImage]} alt={product.name} className="main-image" />
          {product.images.length > 1 && (
            <div className="thumbs">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="product-cat">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-rating">★ {product.rating} ({product.reviews} reviews)</p>
          <p className="detail-price">{formatCurrency(product.price)}</p>
          <p className="detail-desc">{product.description}</p>
          <p className="stock-line">
            {product.stock > 0 ? (
              <>Available: <strong>{product.stock}</strong></>
            ) : (
              <span className="out">Out of stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="qty-row">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Math.min(product.stock, Math.max(1, Number(e.target.value))))}
              />
            </div>
          )}

          <div className="detail-actions">
            <button type="button" className="btn" disabled={!product.stock} onClick={handleAdd}>
              Add to cart
            </button>
            <button type="button" className="btn btn-outline" disabled={!product.stock} onClick={handleBuyNow}>
              Buy now
            </button>
            {user && (
              <button
                type="button"
                className={`btn btn-ghost ${wishlist.includes(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                ♥ Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
