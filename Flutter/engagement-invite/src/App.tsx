import Hero from './components/Hero';
import CountdownSection from './components/CountdownSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-dvh overflow-x-hidden">
      <Hero />
      <CountdownSection />
      <LocationSection />
      <Footer />
    </div>
  );
}
