import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ASSETS, INSTAGRAM, NAV_LINKS } from '../data/product';
import { useStore } from '../context/StoreContext';
import CartDrawer from './CartDrawer';
import './Header.css';

function IconSearch() {
  return (
    <svg fill="none" className="icon" viewBox="0 0 18 19" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M11.03 11.68A5.784 5.784 0 1 1 2.85 3.5a5.784 5.784 0 0 1 8.18 8.18m.26 1.12a6.78 6.78 0 1 1 .72-.7l5.4 5.4a.5.5 0 1 1-.71.7z" clipRule="evenodd" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="icon" viewBox="0 0 18 19" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M6 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15M9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35" clipRule="evenodd" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="icon icon-cart" viewBox="0 0 40 40" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33L28.4 11.8zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1-9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16" aria-hidden="true">
      <path fill="currentColor" d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5" />
    </svg>
  );
}

export default function Header() {
  const { cartQty, user } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/products/may-be-utility-prime-carry-system?q=${encodeURIComponent(searchQ)}`);
      setSearchOpen(false);
    }
  }

  return (
    <>
      <a href="#main" className="skip-link button visually-hidden">Skip to content</a>

      <div className="header-wrapper">
        <header className="header page-width">
          <button
            type="button"
            className="header__icon header__icon--menu"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IconMenu />
          </button>

          <nav className="header__inline-menu" aria-label="Main">
            <ul className="list-menu list-menu--inline">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.to === '/'} className="header__menu-item">
                    {({ isActive }) => (
                      <span className={isActive ? 'header__active-menu-item' : ''}>{link.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <h1 className="header__heading">
            <Link to="/" className="header__heading-link">
              <img src={ASSETS.logo} alt="MAY.BE" className="header__heading-logo" width="160" height="80" />
            </Link>
          </h1>

          <div className="header__icons">
            <button type="button" className="header__icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <button
              type="button"
              className="header__icon small-hide"
              aria-label={user ? 'Account' : 'Log in'}
              onClick={() => navigate(user ? '/account' : '/login')}
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="header__avatar" />
              ) : (
                <IconAccount />
              )}
            </button>
            <button type="button" className="header__icon header__icon--cart" aria-label="Cart" onClick={() => navigate('/cart')}>
              <IconCart />
              {cartQty > 0 && <span className="cart-count-bubble">{cartQty}</span>}
            </button>
          </div>
        </header>
      </div>

      {menuOpen && (
        <div className="menu-drawer">
          <nav>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
            <button type="button" onClick={() => { navigate(user ? '/account' : '/login'); setMenuOpen(false); }}>
              {user ? 'Account' : 'Log in'}
            </button>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="search-modal" role="dialog" aria-label="Search">
          <button type="button" className="search-modal__overlay" aria-label="Close" onClick={() => setSearchOpen(false)} />
          <form className="search-modal__form page-width" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              autoFocus
            />
            <button type="submit" className="button">Search</button>
            <button type="button" className="link-btn" onClick={() => setSearchOpen(false)}>Close</button>
          </form>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
