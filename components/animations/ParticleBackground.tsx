"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: 0 | 1 | 2; // 0 cyan, 1 violet, 2 green
}

interface Symbol {
  x: number;
  y: number;
  speed: number;
  char: string;
  color: string;
  size: number;
  opacity: number;
  drift: number;
}

interface Formula {
  x: number;
  y: number;
  text: string;
  opacity: number;
  velocity: number;
  size: number;
  phase: number; // desplazamiento de fase para animaciones
  sway: number; // amplitud de balanceo
  rotVelocity: number; // rotación lenta
  driftVx: number; // desplazamiento horizontal propio
  blinkSpeed: number; // velocidad de parpadeo
  color: string; // rgb base del texto
}

// Simbología informática / electrónica / matemática / física
const SYMBOLS =
  "01<>{}[];+=/*∑∫√πΔλθΩΦψ≈≠∞→←↑↓±µΩ∇∂ABCDEF0123456789&#@%";

// Ecuaciones y expresiones reales de cálculo, matemática, física y electrónica
const FORMULAS = [
  // Cálculo
  "∫ₐᵇ f(x) dx = F(b) − F(a)",
  "d/dx xⁿ = n·xⁿ⁻¹",
  "lim_{x→0} sin x / x = 1",
  "∫₁/x dx = ln|x| + C",
  "f'(x) = lim_{h→0} [f(x+h)−f(x)]/h",
  "∂f/∂x = lim",
  "∫₀^∞ e^(−x²) dx = √π/2",
  "xe^{x} dx",
  // Física
  "E = mc²",
  "F = G·m₁m₂ / r²",
  "V = IR",
  "F = ma",
  "E = −∇φ",
  "C = Q/V",
  "p = mv",
  "n₂ = sinθ₁ / n₁ sinθ₂",
  "λ = c / f",
  "KE = ½mv²",
  "P = IV",
  "d = ½at² + v₀t",
  // Matemática / álgebra / trigonometría
  "a² + b² = c²",
  "e^(iπ) + 1 = 0",
  "Σᵢ₌₁ⁿ xᵢ = n(n+1)/2",
  "sin²θ + cos²θ = 1",
  "∇·E = ρ / ε₀",
  "(a+b)² = a² + 2ab + b²",
  "log_b(x·y) = log_b x + log_b y",
  "P(A|B) = P(A∩B) / P(B)",
  "x = (−b ± √(b²−4ac)) / 2a",
  "φ = (1+√5)/2",
  "e = lim_{n→∞} (1+1/n)ⁿ",
  "1 + 1/4 + 1/9 + … = π²/6",
  "∇×B = μ₀J",
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let symbols: Symbol[] = [];
    let formulas: Formula[] = [];

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Red de partículas (nodos tipo circuito)
      particles = [];
      const count = Math.min(90, Math.floor((w * h) / 16000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2.2 + 0.8,
          opacity: Math.random() * 0.6 + 0.2,
          hue: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        });
      }

      // Símbolos digitales cayendo
      symbols = [];
      const cols = Math.floor(w / 46);
      for (let i = 0; i < cols; i++) {
        symbols.push({
          x: i * 46 + Math.random() * 20,
          y: Math.random() * h,
          speed: 0.4 + Math.random() * 1.4,
          char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          color:
            Math.random() > 0.6
              ? "0, 255, 102"
              : Math.random() > 0.5
              ? "0, 240, 255"
              : "112, 0, 255",
          size: 10 + Math.random() * 8,
          opacity: 0.08 + Math.random() * 0.35,
          drift: (Math.random() - 0.5) * 0.3,
        });
      }

      // Ecuaciones reales de cálculo/física/matemática flotando
      formulas = [];
      const fCount = Math.min(9, Math.floor(w / 220));
      for (let i = 0; i < fCount; i++) {
        const idx = Math.floor(Math.random() * FORMULAS.length);
        formulas.push({
          x: Math.random() * w,
          y: Math.random() * h,
          text: FORMULAS[idx],
          opacity: 0.045 + Math.random() * 0.1,
          velocity: 0.04 + Math.random() * 0.18,
          size: 13 + Math.random() * 17,
          phase: Math.random() * Math.PI * 2,
          sway: 6 + Math.random() * 18,
          rotVelocity: (Math.random() - 0.5) * 0.0006,
          driftVx: (Math.random() - 0.5) * 0.18,
          blinkSpeed: 0.001 + Math.random() * 0.003,
          color: ["112, 0, 255", "0, 240, 255", "0, 255, 102"][
            Math.floor(Math.random() * 3)
          ],
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["0, 240, 255", "112, 0, 255", "0, 255, 102"];

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Fondo con leve gradiente radial
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(10,10,12,0)");
      grad.addColorStop(1, "rgba(0,240,255,0.03)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // --- 1) Red de partículas conectadas (circuito neural) ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors[p.hue]}, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${colors[p.hue]}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Conexiones con las 3 más cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = 0.06 * (1 - dist / 140);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // --- 2) Símbolos digitales cayendo (estilo code rain) ---
      ctx.font = "monospace";
      for (const s of symbols) {
        s.y += s.speed;
        s.x += s.drift;

        if (s.y > h + 30) {
          s.y = -20;
          s.x = Math.random() * w;
          s.char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }

        ctx.fillStyle = `rgba(${s.color}, ${s.opacity})`;
        ctx.font = `${s.size}px "JetBrains Mono", monospace`;
        ctx.fillText(s.char, s.x, s.y);
      }

      // --- 3) Ecuaciones reales flotando con animación individual ---
      const now = Date.now();
      for (const f of formulas) {
        // movimiento vertical (ascenso lento hacia arriba)
        f.y -= f.velocity;
        // desplazamiento horizontal propio (drift)
        f.x += f.driftVx + Math.sin(now * 0.0002 + f.phase) * 0.04;
        // balanceo lateral sinusoidal (sway)
        const swayX = Math.sin(now * 0.0004 + f.phase) * f.sway;
        // parpadeo suave de opacidad
        const blink = 0.7 + 0.3 * Math.sin(now * f.blinkSpeed * 60 + f.phase);

        // si sale por arriba, reaparece abajo
        if (f.y < -60) {
          f.y = h + 60;
          f.x = Math.random() * w;
          f.text = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
          f.driftVx = (Math.random() - 0.5) * 0.18;
          f.rotVelocity = (Math.random() - 0.5) * 0.0006;
          f.blinkSpeed = 0.001 + Math.random() * 0.003;
        }

        ctx.save();
        ctx.translate(f.x + swayX, f.y);
        ctx.rotate(Math.sin(now * f.rotVelocity * 60 + f.phase) * 0.06);
        // medir el ancho para centrar horizontalmente el texto en el punto
        ctx.font = `500 ${f.size}px "JetBrains Mono", monospace`;
        const tw = ctx.measureText(f.text).width;
        ctx.fillStyle = `rgba(${f.color}, ${f.opacity * blink})`;
        ctx.fillText(f.text, -tw / 2, 0);
        ctx.restore();
      }

      // --- 4) Onda osciloscopio en la parte inferior ---
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y =
          h - 40 +
          Math.sin(x * 0.02 + Date.now() * 0.002) * 8 +
          Math.sin(x * 0.031 + Date.now() * 0.003) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(0, 255, 102, 0.15)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.75 }}
      aria-hidden="true"
    />
  );
}
