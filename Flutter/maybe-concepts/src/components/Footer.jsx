import { Link } from 'react-router-dom';
import { FOOTER_LINKS, INSTAGRAM, PAYMENT_METHODS } from '../data/product';
import EmailCapture from './EmailCapture';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer color-scheme-footer">
      <div className="footer__content-top page-width">
        <EmailCapture />
        <ul className="footer__list-social">
          <li>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              Instagram
            </a>
          </li>
        </ul>
      </div>

      <div className="footer__content-bottom page-width">
        <div className="footer__payment">
          <span className="visually-hidden">Payment methods</span>
          <ul className="list-payment">
            {PAYMENT_METHODS.map((m) => (
              <li key={m} className="list-payment__item"><span>{m}</span></li>
            ))}
          </ul>
        </div>

        <div className="footer__copyright">
          <small>© 2026, <Link to="/">MAY.BE</Link></small>
          <small className="demo-tag">Demo React build (no database)</small>
          <ul className="policies">
            {FOOTER_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
