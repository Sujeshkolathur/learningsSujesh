export const ASSETS = {
  logo: 'https://maybeconcepts.com/cdn/shop/files/299727.png?v=1782540704&width=320',
  hero: 'https://maybeconcepts.com/cdn/shop/files/Screenshot_20260619_155756_Gallery.jpg?v=1782238146&width=2000',
  product: 'https://maybeconcepts.com/cdn/shop/files/rn-image_picker_lib_temp_3b563af1-ad67-4016-aae3-abc878be2de0.jpg?v=1781895768&width=1946',
  og: 'https://maybeconcepts.com/cdn/shop/files/299727.png?v=1782540704&width=1200',
};

export const PRODUCT = {
  id: 'utility-prime-001',
  drop: 'DROP 001 - LAUNCH EDITION',
  name: 'UTILITY PRIME- CARRY SYSTEM',
  handle: 'may-be-utility-prime-carry-system',
  price: 1999,
  compareAt: 2499,
  currency: 'INR',
  inStock: true,
  stock: 69,
  units: 69,
  description:
    'A carry system built for movement. Ripstop shell, YKK zippers, fluorescent orange lining. 69 units. Drop 001.',
  images: [ASSETS.product],
  transmission: 'TRANSMISSION 26.07',
  category: 'Tote Bags',
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'UTILITY PRIME', to: '/products/may-be-utility-prime-carry-system' },
  { label: 'CONNECT', to: '/connect' },
];

export const FOOTER_LINKS = [
  { label: 'Privacy policy', to: '/policies/privacy-policy' },
  { label: 'Refund policy', to: '/policies/refund-policy' },
  { label: 'Terms of service', to: '/policies/terms-of-service' },
  { label: 'Contact information', to: '/connect' },
  { label: 'Shipping policy', to: '/policies/shipping-policy' },
  { label: 'Legal notice', to: '/policies/legal-notice' },
];

export const INSTAGRAM = 'https://www.instagram.com/maybe.labs?igsh=MTVlbzR1NDVpZ3JuZQ==';

export const PAYMENT_METHODS = [
  'American Express', 'Diners Club', 'Maestro', 'Mastercard', 'RuPay', 'Visa',
];
