import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import './EmailCapture.css';

export default function EmailCapture() {
  const { subscribe } = useStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = subscribe(email);
    setMessage(result.message);
    if (result.ok) setEmail('');
  }

  return (
    <div className="footer-block__newsletter">
      <h2 className="footer-block__heading">ENTER THE SYSTEM.</h2>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="newsletter-form__field-wrapper">
          <input
            id="newsletter-email"
            type="email"
            name="contact[email]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit" className="newsletter-form__button" aria-label="Subscribe">→</button>
        </div>
      </form>
      {message && <p className="capture-msg">{message}</p>}
    </div>
  );
}
