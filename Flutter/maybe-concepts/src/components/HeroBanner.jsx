import { Link } from 'react-router-dom';
import { ASSETS, PRODUCT } from '../data/product';
import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-banner__media">
        <img src={ASSETS.hero} alt="" fetchPriority="high" />
      </div>
      <div className="hero-banner__content page-width">
        <div className="hero-banner__buttons">
          <Link to="/products/may-be-utility-prime-carry-system" className="button button--secondary">
            SEE WHAT WE MADE&gt;
          </Link>
          <span className="button button--primary button--disabled" aria-disabled="true">
            {PRODUCT.transmission}
          </span>
        </div>
      </div>
    </section>
  );
}
