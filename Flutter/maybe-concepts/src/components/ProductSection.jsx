import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';
import './ProductSection.css';

export default function ProductSection({ fullPage = false }) {
  const navigate = useNavigate();
  const { product, addToCart, cartLine } = useStore();
  const [qty, setQty] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const inCart = cartLine?.quantity || 0;
  const shareUrl = `${window.location.origin}/products/may-be-utility-prime-carry-system`;

  function handleAdd() {
    addToCart(qty);
  }

  function handleBuyNow() {
    addToCart(qty);
    navigate('/checkout');
  }

  function handleShare() {
    navigator.clipboard.writeText(shareUrl);
    setShareOpen(true);
  }

  return (
    <section className={`featured-product color-scheme-dark ${fullPage ? 'featured-product--page' : ''}`}>
      <div className="page-width section-padding">
        <div className="product product--medium grid grid--2-col">
          <div className="product__media-wrapper">
            <div className="product-media-container">
              <button type="button" className="product__media-zoom" onClick={() => setLightbox(true)} aria-label="Open media in modal">
                <img src={product.images[0]} alt={product.name} className="product__media" />
              </button>
            </div>
          </div>

          <div className="product__info-wrapper">
            <p className="product__text subtitle">{product.drop}</p>
            <h2 className="product__title">{product.name}</h2>

            <div className="price price--large price--on-sale">
              <div className="price__sale">
                <span className="visually-hidden">Regular price</span>
                <s className="price-item price-item--regular">{formatINR(product.compareAt)}</s>
                <span className="visually-hidden">Sale price</span>
                <span className="price-item price-item--sale">{formatINR(product.price)}</span>
              </div>
              <span className="badge price__badge-sale">Sale</span>
              {!product.inStock && <span className="badge price__badge-sold-out">Sold out</span>}
            </div>

            <p className="product__tax caption">
              Taxes included.
              <Link to="/policies/shipping-policy"> Shipping</Link> calculated at checkout.
            </p>

            <div className="product-form__quantity">
              <label htmlFor="qty">Quantity</label>
              <div className="quantity">
                <button type="button" aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                />
                <button type="button" aria-label="Increase" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <span className="quantity__rules-cart">(<span>{inCart}</span> in cart)</span>
            </div>

            <div className="product-form__buttons">
              <button
                type="button"
                className="button button--full-width button--secondary"
                disabled={!product.inStock}
                onClick={handleAdd}
              >
                Add to cart
              </button>
              <button
                type="button"
                className="button button--full-width button--primary"
                disabled={!product.inStock}
                onClick={handleBuyNow}
              >
                Buy it now
              </button>
            </div>

            <share-button className="share-button">
              <button type="button" className="share-button__button" onClick={() => setShareOpen(!shareOpen)}>
                Share
              </button>
              {shareOpen && (
                <div className="share-button__fallback">
                  <input type="text" readOnly value={shareUrl} onClick={(e) => e.target.select()} />
                  <button type="button" onClick={handleShare}>Copy link</button>
                  <button type="button" className="link-btn" onClick={() => setShareOpen(false)}>Close share</button>
                </div>
              )}
            </share-button>

            {fullPage && <p className="product__description rte">{product.description}</p>}

            {!fullPage && (
              <Link to="/products/may-be-utility-prime-carry-system" className="product__view-details">
                View full details →
              </Link>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="media-modal" role="dialog" aria-label="Media gallery" onClick={() => setLightbox(false)}>
          <button type="button" className="media-modal__close" aria-label="Close">×</button>
          <img src={product.images[0]} alt={product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
