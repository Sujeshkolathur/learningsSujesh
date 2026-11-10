import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleSignIn from '../components/GoogleSignIn';
import { useStore } from '../context/StoreContext';
import '../components/GoogleSignIn.css';

export function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
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
    navigate('/account');
  }

  return (
    <div className="page-narrow auth-page">
      <h1>Log in</h1>
      <p className="muted">Sign in with Google or use demo email login (stored locally).</p>

      <GoogleSignIn />

      <div className="auth-divider">or</div>

      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="button button--primary button--full-width">Log in with email</button>
      </form>
      <Link to="/" className="text-link">Back</Link>
    </div>
  );
}

export function Account() {
  const { user, logout } = useStore();
  const orders = JSON.parse(localStorage.getItem('maybe_be_orders') || '[]');
  const myOrders = user ? orders.filter((o) => !o.email || o.email === user.email) : [];

  if (!user) {
    return (
      <div className="page-narrow">
        <p>Please log in.</p>
        <Link to="/login">Log in</Link>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <h1>Account</h1>

      <div className="account-profile">
        {user.picture && <img src={user.picture} alt="" />}
        <div>
          <p><strong>{user.name}</strong></p>
          <p className="muted">{user.email}</p>
          {user.provider === 'google' && <span className="account-badge">Signed in with Google</span>}
        </div>
      </div>

      <button type="button" className="text-btn" onClick={logout}>Log out</button>

      <h2>Orders (demo)</h2>
      {!myOrders.length ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <ul className="order-list">
          {myOrders.map((o) => (
            <li key={o.id}>
              <strong>{o.id}</strong> — ₹{o.total} — {new Date(o.at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
