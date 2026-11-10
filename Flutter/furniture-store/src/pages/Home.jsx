import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/seedData';
import './Home.css';

export default function Home() {
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const featured = products.filter((p) => p.stock > 0).slice(0, 4);

  function handleAdd(id) {
    const result = addToCart(id);
    if (!result.ok) alert(result.message);
  }

  return (
    <div>
      <section className="hero-banner">
        <div className="container hero-content">
          <p className="eyebrow">Premium furniture · Free delivery over ₹10,000</p>
          <h1>Beautiful spaces start with the right furniture</h1>
          <p>Shop chairs, tables, sofas, beds, and storage — demo store with cart, checkout, and admin dashboard.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn">Browse furniture</Link>
            <Link to="/products?category=Chair" className="btn btn-outline">Shop chairs</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Shop by category</h2>
        <div className="category-grid">
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-card">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">Featured products</h2>
          <Link to="/products">View all →</Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={handleAdd}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlist.includes(p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
