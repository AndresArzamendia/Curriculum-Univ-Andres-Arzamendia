"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/animations/ParticleBackground";
import ContactSection from "@/components/portfolio/ContactSection";

export default function ContactoPage() {
  return (
    <>
      <ParticleBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
