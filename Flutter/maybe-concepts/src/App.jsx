import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StoreProvider } from './context/StoreContext';
import Layout from './Layout';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Connect from './pages/Connect';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { Login, Account } from './pages/Auth';
import PolicyPage from './pages/PolicyPage';
import { isGoogleConfigured } from './utils/googleAuth';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppRoutes() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/may-be-utility-prime-carry-system" element={<ProductPage />} />
            <Route path="utility-prime" element={<ProductPage />} />
            <Route path="connect" element={<Connect />} />
            <Route path="policies/:slug" element={<PolicyPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="login" element={<Login />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default function App() {
  if (!isGoogleConfigured()) {
    return <AppRoutes />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}
