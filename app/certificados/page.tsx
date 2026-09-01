"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/animations/ParticleBackground";
import CertificatesSection from "@/components/portfolio/CertificatesSection";

export default function CertificadosPage() {
  return (
    <>
      <ParticleBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <CertificatesSection />
      </main>
      <Footer />
    </>
  );
}
