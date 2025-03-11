import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeroSection } from "@/components/home/hero-section";
import { ServiceCategories } from "@/components/home/service-categories";
import { ServiceProfessionals } from "@/components/home/service-professionals";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { AppDownload } from "@/components/home/app-download";
import { BookingModal } from "@/components/booking/booking-modal";

export default function Home() {
  return (
    <div className="font-['Nunito_Sans'] text-[#2D3436] bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <main className="pt-16 pb-20 md:pb-10">
        <HeroSection />
        <ServiceCategories />
        <ServiceProfessionals />
        <HowItWorks />
        <Testimonials />
        <AppDownload />
      </main>
      
      <Footer />
      <MobileNav />
      <BookingModal />
    </div>
  );
}
