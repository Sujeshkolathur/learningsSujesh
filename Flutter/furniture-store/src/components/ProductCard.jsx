import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="badge badge-sold">Out of stock</span>}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge badge-low">Only {product.stock} left</span>
        )}
      </Link>
      <div className="product-body">
        <p className="product-cat">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-meta">
          <span className="price">{formatCurrency(product.price)}</span>
          <span className="rating">★ {product.rating}</span>
        </div>
        <div className="product-actions">
          <button
            type="button"
            className="btn btn-sm"
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product.id)}
          >
            Add to cart
          </button>
          <button
            type="button"
            className={`btn btn-ghost btn-sm ${isWishlisted ? 'active' : ''}`}
            onClick={() => onToggleWishlist?.(product.id)}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}
