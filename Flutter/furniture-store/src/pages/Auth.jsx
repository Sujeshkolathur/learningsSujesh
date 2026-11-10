import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import './Auth.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(result.user.role === 'admin' ? '/admin' : '/');
  }

  return (
    <div className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <label>Email<input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button type="submit" className="btn btn-full">Login</button>
        <p className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link> · <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/');
  }

  return (
    <div className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        {error && <p className="error">{error}</p>}
        <label>Name<input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Phone<input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label>Password<input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button type="submit" className="btn btn-full">Register</button>
        <p className="auth-links"><Link to="/login">Already have an account?</Link></p>
      </form>
    </div>
  );
}

export function ForgotPassword() {
  const { resetPasswordDemo } = useStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = resetPasswordDemo(email);
    setMessage(result.message);
  }

  return (
    <div className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h1>Forgot password</h1>
        <p className="hint">Demo mode — simulates sending a reset link.</p>
        <label>Email<input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        {message && <p className={message.includes('sent') ? 'success' : 'error'}>{message}</p>}
        <button type="submit" className="btn btn-full">Send reset link</button>
        <p className="auth-links"><Link to="/login">Back to login</Link></p>
      </form>
    </div>
  );
}

export function Wishlist() {
  const { products, wishlist, addToCart, toggleWishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container section">
      <h1 className="section-title">Wishlist</h1>
      {!items.length ? (
        <p className="empty-msg">Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={(id) => {
                const r = addToCart(id);
                if (!r.ok) alert(r.message);
              }}
              onToggleWishlist={toggleWishlist}
              isWishlisted
            />
          ))}
        </div>
      )}
    </div>
  );
}
