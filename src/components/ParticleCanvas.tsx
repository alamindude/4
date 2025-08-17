import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface ParticleCanvasProps {
  mode: 'fire' | 'water';
}

export const ParticleCanvas = ({ mode }: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const createParticle = (x: number, y: number): Particle => {
      const baseHue = mode === 'fire' ? 20 : 220; // Orange for fire, blue for water
      const hueVariation = mode === 'fire' ? 40 : 60;
      
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: mode === 'fire' ? -Math.random() * 3 - 1 : (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 30 + Math.random() * 30,
        size: Math.random() * 8 + 2,
        hue: baseHue + (Math.random() - 0.5) * hueVariation
      };
    };

    const updateParticles = () => {
      // Add new particles at mouse position
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(createParticle(
          mouseRef.current.x + (Math.random() - 0.5) * 20,
          mouseRef.current.y + (Math.random() - 0.5) * 20
        ));
      }

      // Update existing particles
      particlesRef.current = particlesRef.current
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1/particle.maxLife,
          vx: particle.vx * 0.98,
          vy: mode === 'fire' ? particle.vy + 0.1 : particle.vy * 0.98
        }))
        .filter(particle => particle.life > 0);

      // Keep particle count reasonable
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        const alpha = particle.life;
        const saturation = mode === 'fire' ? 90 : 70;
        const lightness = mode === 'fire' ? 60 + particle.life * 40 : 50 + particle.life * 30;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${particle.hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = `hsl(${particle.hue}, ${saturation}%, ${lightness}%)`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export const ParticleModeToggle = () => {
  const [mode, setMode] = useState<'fire' | 'water'>('fire');

  return (
    <>
      <ParticleCanvas mode={mode} />
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={() => setMode(mode === 'fire' ? 'water' : 'fire')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${mode === 'fire' 
              ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-300 shadow-[0_0_20px_hsl(30_100%_60%/0.3)]' 
              : 'bg-blue-500/20 border-2 border-blue-500 text-blue-300 shadow-[0_0_20px_hsl(220_100%_60%/0.3)]'
            }
            hover:scale-105 hover:shadow-[0_0_30px_currentColor/0.5]
          `}
        >
          {mode === 'fire' ? '🔥 Fire' : '💧 Water'}
        </button>
      </motion.div>
    </>
  );
};
