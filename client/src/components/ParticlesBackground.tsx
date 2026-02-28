import { useEffect, useMemo, useState } from 'react';
import { loadSlim } from '@tsparticles/slim';
import { Particles as ParticlesComponent } from '@tsparticles/react';
import { useTheme } from '../context/ThemeContext';

export default function ParticlesBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadSlim(undefined as never).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: theme === 'dark' ? '#8b5cf6' : '#6366f1',
      },
      links: {
        color: theme === 'dark' ? '#8b5cf6' : '#6366f1',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 60,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), [theme]);

  if (!mounted || !init) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <ParticlesComponent
        id="tsparticles"
        options={options}
        className="absolute inset-0"
      />
    </div>
  );
}
