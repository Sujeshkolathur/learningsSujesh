import Hero from './components/Hero';
import FirstHello from './components/FirstHello';
import DreamsSection from './components/DreamsSection';
import JourneyTimeline from './components/JourneyTimeline';
import HappinessSection from './components/HappinessSection';
import FutureSection from './components/FutureSection';
import EngagementCountdown from './components/EngagementCountdown';
import SpecialDays from './components/SpecialDays';
import BirthdayLetter from './components/BirthdayLetter';
import VoiceMessage from './components/VoiceMessage';
import PhotoGallery from './components/PhotoGallery';
import PromiseSection from './components/PromiseSection';
import SecretMessage from './components/SecretMessage';
import FinalSection from './components/FinalSection';

export default function App() {
  return (
    <main className="overflow-x-hidden">
        <Hero />
        <FirstHello />
        <DreamsSection />
        <JourneyTimeline />
        <HappinessSection />
        <FutureSection />
        <EngagementCountdown />
        <SpecialDays />
        <PhotoGallery />
        <VoiceMessage />
        <BirthdayLetter />
        <PromiseSection />
        <SecretMessage />
        <FinalSection />
    </main>
  );
}
