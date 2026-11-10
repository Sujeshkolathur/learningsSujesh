import { useParams } from 'react-router-dom';

const TITLES = {
  'privacy-policy': 'Privacy policy',
  'refund-policy': 'Refund policy',
  'terms-of-service': 'Terms of service',
  'shipping-policy': 'Shipping policy',
  'legal-notice': 'Legal notice',
};

export default function PolicyPage() {
  const { slug } = useParams();
  const title = TITLES[slug] || 'Policy';

  return (
    <div className="page-narrow policy-page">
      <h1>{title}</h1>
      <p className="muted">Demo placeholder matching MAY.BE Shopify policy routes. No database required.</p>
    </div>
  );
}
