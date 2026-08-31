"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/animations/ParticleBackground";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import CertificatesSection from "@/components/portfolio/CertificatesSection";
import ContactSection from "@/components/portfolio/ContactSection";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <AboutSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <SkillsSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <ProjectsSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <CertificatesSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
