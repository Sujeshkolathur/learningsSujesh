import { createContext, useContext, useEffect, useState } from 'react';
import { PRODUCT } from '../data/product';
import { parseGoogleCredential } from '../utils/googleAuth';
import { load, save } from '../utils/storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('cart', []));
  const [user, setUser] = useState(() => load('user', null));
  const [subscribers, setSubscribers] = useState(() => load('subscribers', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => save('cart', cart), [cart]);
  useEffect(() => save('user', user), [user]);
  useEffect(() => save('subscribers', subscribers), [subscribers]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  function addToCart(quantity = 1) {
    if (!PRODUCT.inStock) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === PRODUCT.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === PRODUCT.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, PRODUCT.stock) }
            : i
        );
      }
      return [...prev, { productId: PRODUCT.id, quantity }];
    });
    setCartOpen(true);
    showToast('Item added to your cart');
  }

  function updateQty(quantity) {
    if (quantity <= 0) {
      setCart([]);
      return;
    }
    setCart([{ productId: PRODUCT.id, quantity: Math.min(quantity, PRODUCT.stock) }]);
  }

  function clearCart() {
    setCart([]);
  }

  function login(email, password) {
    if (!email || password.length < 4) {
      return { ok: false, message: 'Enter a valid email and password (min 4 chars).' };
    }
    const profile = { email, name: email.split('@')[0], provider: 'email' };
    setUser(profile);
    return { ok: true };
  }

  function loginWithGoogle(credential) {
    const profile = parseGoogleCredential(credential);
    if (!profile) {
      return { ok: false, message: 'Could not verify Google sign-in.' };
    }
    setUser(profile);
    return { ok: true, user: profile };
  }

  function logout() {
    setUser(null);
  }

  function subscribe(email) {
    if (!email || !email.includes('@')) {
      return { ok: false, message: 'Enter a valid email.' };
    }
    if (subscribers.includes(email.toLowerCase())) {
      return { ok: false, message: 'Already subscribed.' };
    }
    setSubscribers((prev) => [...prev, email.toLowerCase()]);
    return { ok: true, message: 'You entered the system.' };
  }

  const cartQty = cart.reduce((s, i) => s + i.quantity, 0);
  const cartLine = cart.find((i) => i.productId === PRODUCT.id);
  const cartTotal = cartLine ? cartLine.quantity * PRODUCT.price : 0;

  const value = {
    product: PRODUCT,
    cart,
    cartQty,
    cartLine,
    cartTotal,
    cartOpen,
    setCartOpen,
    user,
    toast,
    addToCart,
    updateQty,
    clearCart,
    login,
    loginWithGoogle,
    logout,
    subscribe,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
