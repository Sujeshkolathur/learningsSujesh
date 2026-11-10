import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import EmailCapture from '../components/EmailCapture';
import './Connect.css';

export default function Connect() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('maybe_be_messages') || '[]');
    existing.push({ ...form, at: new Date().toISOString() });
    localStorage.setItem('maybe_be_messages', JSON.stringify(existing));
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="connect-page">
      <h1>CONNECT</h1>
      <p className="connect-lead">Transmission channel open. Drop a signal.</p>

      {sent ? (
        <p className="connect-success">Message received. We&apos;ll respond on your frequency.</p>
      ) : (
        <form className="connect-form" onSubmit={handleSubmit}>
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" className="btn">Transmit</button>
        </form>
      )}

      <div className="connect-meta">
        <p>Instagram · @maybeconcepts</p>
        <p>support@maybeconcepts.com</p>
      </div>

      <EmailCapture />
    </div>
  );
}
