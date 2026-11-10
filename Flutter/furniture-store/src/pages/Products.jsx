import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/seedData';
import './Home.css';
import './Products.css';

export default function Products() {
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, search, sort]);

  function handleAdd(id) {
    const result = addToCart(id);
    if (!result.ok) alert(result.message);
  }

  return (
    <div className="container section">
      <h1 className="section-title">Shop furniture</h1>

      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input">
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>

      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={handleAdd}
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishlist.includes(p.id)}
          />
        ))}
      </div>

      {!filtered.length && (
        <p className="empty-msg">No products match your search.</p>
      )}
    </div>
  );
}
