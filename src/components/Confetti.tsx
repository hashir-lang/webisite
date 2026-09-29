import { useEffect, useRef } from "react";

/**
 * Lightweight, dependency-free confetti burst drawn on a full-screen canvas.
 * Fires once on mount, runs for a few seconds, then cleans itself up.
 * Honours prefers-reduced-motion (renders nothing).
 */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vrot: number;
  shape: "rect" | "circle";
};

const COLORS = ["#6b2fb3", "#e0654f", "#3a1d4e", "#d98fc9", "#e6b450", "#2bb39a"];

const Confetti = ({ count = 160, duration = 4500 }: { count?: number; duration?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Two side cannons firing inward + a top sprinkle.
    const particles: Particle[] = [];
    const spawn = (n: number, originX: number, spread: number, baseVx: number) => {
      for (let i = 0; i < n; i++) {
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * spread;
        const speed = 8 + Math.random() * 9;
        particles.push({
          x: originX,
          y: h * 0.65,
          vx: Math.cos(angle) * speed + baseVx,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          size: 5 + Math.random() * 7,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        });
      }
    };
    spawn(Math.round(count * 0.4), 0, 0.6, 6);
    spawn(Math.round(count * 0.4), w, 0.6, -6);
    spawn(Math.round(count * 0.2), w / 2, 1.4, 0);

    const start = performance.now();
    let raf = 0;
    const gravity = 0.22;
    const drag = 0.992;

    const tick = (now: number) => {
      const elapsed = now - start;
      const fade = Math.max(0, 1 - Math.max(0, elapsed - duration * 0.6) / (duration * 0.4));
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
};

export default Confetti;
