import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Collections from "@/components/Collections";
import ProductShowcase from "@/components/ProductShowcase";
import Performance from "@/components/Performance";
import PerformanceIndex from "@/components/PerformanceIndex";
import Editorial from "@/components/Editorial";
import Journal from "@/components/Journal";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Collections />
      <ProductShowcase />
      <Performance />
      <PerformanceIndex />
      <Editorial />
      <Journal />
      <FinalCTA />
    </main>
  );
}