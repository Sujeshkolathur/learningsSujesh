import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_PRODUCTS, SEED_USERS } from '../data/seedData';
import { load, save } from '../utils/storage';

const StoreContext = createContext(null);

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function initState() {
  const users = load('users', null);
  const products = load('products', null);
  const orders = load('orders', []);
  const session = load('session', null);

  if (!users) save('users', SEED_USERS);
  if (!products) save('products', SEED_PRODUCTS);

  return {
    users: users || SEED_USERS,
    products: products || SEED_PRODUCTS,
    orders,
    session,
    carts: load('carts', {}),
    wishlists: load('wishlists', {}),
    notifications: load('notifications', []),
  };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(initState);

  useEffect(() => {
    save('users', state.users);
    save('products', state.products);
    save('orders', state.orders);
    save('session', state.session);
    save('carts', state.carts);
    save('wishlists', state.wishlists);
    save('notifications', state.notifications);
  }, [state]);

  const user = state.session
    ? state.users.find((u) => u.id === state.session.userId) || null
    : null;

  const cart = user ? state.carts[user.id] || [] : [];
  const wishlist = user ? state.wishlists[user.id] || [] : [];

  const cartDetails = useMemo(() => {
    return cart.map((item) => {
      const product = state.products.find((p) => p.id === item.productId);
      return { ...item, product };
    }).filter((i) => i.product);
  }, [cart, state.products]);

  const cartTotal = cartDetails.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function login(email, password) {
    const found = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, message: 'Invalid email or password' };
    setState((s) => ({ ...s, session: { userId: found.id } }));
    return { ok: true, user: found };
  }

  function logout() {
    setState((s) => ({ ...s, session: null }));
  }

  function register({ name, email, phone, password }) {
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Email already registered' };
    }
    const newUser = {
      id: uid('user'),
      name,
      email,
      phone,
      password,
      role: 'customer',
    };
    setState((s) => ({
      ...s,
      users: [...s.users, newUser],
      session: { userId: newUser.id },
    }));
    return { ok: true };
  }

  function resetPasswordDemo(email) {
    const exists = state.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    return exists
      ? { ok: true, message: 'Demo: reset link sent to your email (simulated).' }
      : { ok: false, message: 'No account found with that email.' };
  }

  function addToCart(productId, quantity = 1) {
    if (!user) return { ok: false, message: 'Please login to add items to cart' };
    const product = state.products.find((p) => p.id === productId);
    if (!product || product.stock < quantity) {
      return { ok: false, message: 'Insufficient stock' };
    }
    setState((s) => {
      const userCart = [...(s.carts[user.id] || [])];
      const existing = userCart.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        userCart.push({ productId, quantity });
      }
      return { ...s, carts: { ...s.carts, [user.id]: userCart } };
    });
    return { ok: true };
  }

  function updateCartQty(productId, quantity) {
    if (!user) return;
    setState((s) => {
      const userCart = (s.carts[user.id] || [])
        .map((i) => (i.productId === productId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      return { ...s, carts: { ...s.carts, [user.id]: userCart } };
    });
  }

  function removeFromCart(productId) {
    if (!user) return;
    setState((s) => ({
      ...s,
      carts: {
        ...s.carts,
        [user.id]: (s.carts[user.id] || []).filter((i) => i.productId !== productId),
      },
    }));
  }

  function clearCart() {
    if (!user) return;
    setState((s) => ({ ...s, carts: { ...s.carts, [user.id]: [] } }));
  }

  function toggleWishlist(productId) {
    if (!user) return { ok: false, message: 'Please login to use wishlist' };
    setState((s) => {
      const list = s.wishlists[user.id] || [];
      const exists = list.includes(productId);
      const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
      return { ...s, wishlists: { ...s.wishlists, [user.id]: updated } };
    });
    return { ok: true };
  }

  function placeOrder({ paymentMethod, address }) {
    if (!user) return { ok: false, message: 'Login required' };
    if (!cartDetails.length) return { ok: false, message: 'Cart is empty' };

    for (const item of cartDetails) {
      if (item.quantity > item.product.stock) {
        return { ok: false, message: `${item.product.name} has insufficient stock` };
      }
    }

    const orderId = uid('order');
    const orderNumber = String(10000 + state.orders.length + 1);
    const amount = cartTotal;
    const items = cartDetails.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price,
    }));

    const order = {
      id: orderId,
      orderNumber,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      amount,
      status: 'PENDING',
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
      paymentMethod,
      address,
      items,
      createdDate: new Date().toISOString(),
      expectedDelivery: deliveryDateISO(5),
    };

    const payment = {
      paymentId: uid('pay'),
      orderId,
      gateway: paymentMethod,
      status: order.paymentStatus,
      transactionId: paymentMethod === 'razorpay' ? `rzp_demo_${Date.now()}` : null,
    };

    const updatedProducts = state.products.map((p) => {
      const ordered = items.find((i) => i.productId === p.id);
      if (!ordered) return p;
      return { ...p, stock: p.stock - ordered.qty };
    });

    const emailNotification = {
      id: uid('notif'),
      type: 'email',
      orderId,
      to: user.email,
      subject: 'Your Order has been placed',
      body: buildEmailBody(user.name, orderNumber, items, amount, order.expectedDelivery),
      createdAt: new Date().toISOString(),
    };

    setState((s) => ({
      ...s,
      products: updatedProducts,
      orders: [order, ...s.orders],
      carts: { ...s.carts, [user.id]: [] },
      notifications: [emailNotification, ...s.notifications],
    }));

    return { ok: true, order, payment };
  }

  function deliveryDateISO(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  function buildEmailBody(name, orderNumber, items, amount, expectedDelivery) {
    const itemLines = items.map((i) => `${i.name} x${i.qty}`).join('\n');
    return `Hi ${name},\n\nThank you for shopping.\n\nOrder Number: #${orderNumber}\n\nItems:\n${itemLines}\n\nTotal: ₹${amount.toLocaleString('en-IN')}\n\nExpected Delivery: ${new Date(expectedDelivery).toLocaleDateString('en-IN')}`;
  }

  function updateOrderStatus(orderId, status) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  }

  function addProduct(product) {
    const newProduct = { ...product, id: uid('prod'), rating: 4, reviews: 0 };
    setState((s) => ({ ...s, products: [newProduct, ...s.products] }));
    return newProduct;
  }

  function updateProduct(id, updates) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }

  function deleteProduct(id) {
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
  }

  const adminStats = useMemo(() => {
    const today = new Date().toDateString();
    const ordersToday = state.orders.filter(
      (o) => new Date(o.createdDate).toDateString() === today
    );
    const revenueToday = ordersToday.reduce((s, o) => s + o.amount, 0);
    return {
      totalProducts: state.products.length,
      ordersToday: ordersToday.length,
      revenueToday,
      pendingOrders: state.orders.filter((o) => o.status === 'PENDING').length,
      outOfStock: state.products.filter((p) => p.stock === 0).length,
      totalOrders: state.orders.length,
      totalRevenue: state.orders.reduce((s, o) => s + o.amount, 0),
    };
  }, [state.products, state.orders]);

  const value = {
    user,
    products: state.products,
    orders: state.orders,
    notifications: state.notifications,
    cart,
    cartDetails,
    cartTotal,
    cartCount,
    wishlist,
    adminStats,
    login,
    logout,
    register,
    resetPasswordDemo,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    placeOrder,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
