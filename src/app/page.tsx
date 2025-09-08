import HeroSection from "@/components/ui/hero-section";
import MarqueeSection from "@/components/ui/marquee-section";
import StatisticsSection from "@/components/ui/statistics-section";
import BloodTypeSection from "@/components/ui/blood-type-section";
import ShortageAndDemandGraph from "@/components/ui/shortage-demand-graph";
import FeaturesSection from "@/components/ui/features-section";
import DonationProcess from "@/components/ui/donation-process";
import AIChatbox from "@/components/ui/ai-chatbox";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MarqueeSection />
      <StatisticsSection />
      <BloodTypeSection />
      <div className="py-16 px-4 bg-gray-50">
        <ShortageAndDemandGraph />
      </div>
      <FeaturesSection />
      <DonationProcess />
      <AIChatbox />
    </div>
  );
}
