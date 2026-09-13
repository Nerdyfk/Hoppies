import confetti from 'canvas-confetti';

/**
 * Fires a celebratory multi-cannon confetti blast in BunInk and Inkonchain theme colors.
 */
export const triggerWhitelistConfetti = () => {
  try {
    // Primary center burst
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#7B3FE4', '#9333EA', '#10B981', '#00D2FF', '#EC4899', '#FBBF24'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // Left cannon sweep
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#7B3FE4', '#EC4899', '#38BDF8', '#F59E0B'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 150);

    // Right cannon sweep
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#10B981', '#A855F7', '#00D2FF', '#F43F5E'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 300);

    // Final celebratory star shimmer shower
    setTimeout(() => {
      confetti({
        particleCount: 35,
        spread: 100,
        origin: { y: 0.4, x: 0.5 },
        shapes: ['circle'],
        scalar: 1.2,
        colors: ['#A855F7', '#34D399', '#FDE047', '#60A5FA'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    }, 500);
  } catch (err) {
    console.error('Failed to trigger confetti:', err);
  }
};
