import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useStore } from './context/StoreContext';

export default function Layout() {
  const { toast } = useStore();

  return (
    <>
      <Header />
      <main id="MainContent" className="content-for-layout">
        <Outlet />
      </main>
      <Footer />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
