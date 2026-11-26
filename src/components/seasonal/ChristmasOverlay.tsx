import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ChristmasOverlay — capa navideña global, apagable.
 *
 * - Nieve cayendo (CSS puro, liviana, respeta prefers-reduced-motion).
 * - Guirnalda de luces rojas/verdes/doradas arriba.
 * - Botón flotante 🎄 para prender/apagar todo (se recuerda en localStorage).
 * - Música opcional opt-in (un clic en la bocina; los navegadores NO permiten
 *   audio automático). Archivo libre de regalías en MUSIC_SRC.
 *
 * Montar UNA vez dentro del Router (ej. en App, junto al resto del layout).
 * Se auto-oculta en las invitaciones normales de clientes (bodas, xv, etc.) y dashboard,
 * pero se activa en el sitio público Y en las invitaciones de la edición Navidad (Plan Pro / Clásica).
 */

// Archivo de música libre de regalías (We Wish You a Merry Christmas)
const MUSIC_SRC = '/sounds/christmas.mp3';

// Rutas excluidas por defecto (invitaciones regulares de clientes y panel de dashboard).
const EXCLUDED_PREFIXES = ['/i/', '/std/', '/preview/', '/invitacion/', '/dashboard', '/carlos-y-frida', '/carlosyfrida'];

const SNOWFLAKE_COUNT = 50;
const STORAGE_KEY = 'invitto_xmas_enabled';

type Flake = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
};

function readEnabled(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === 'on'; // por defecto: encendido
  } catch {
    return true;
  }
}

function writeEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
}

export default function ChristmasOverlay() {
  const location = useLocation();
  const [enabled, setEnabled] = useState<boolean>(readEnabled);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Escuchar si la invitación actual en pantalla pertenece a la edición Navidad
  const [isChristmasEventActive, setIsChristmasEventActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean((window as any).__INVITTO_CHRISTMAS_EVENT__);
    }
    return false;
  });

  useEffect(() => {
    const handleXmasEvent = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsChristmasEventActive(Boolean(customEvent.detail));
    };
    window.addEventListener('invitto:xmas-event-active', handleXmasEvent);
    return () => window.removeEventListener('invitto:xmas-event-active', handleXmasEvent);
  }, []);

  const path = location.pathname.toLowerCase();
  const isChristmasPath = 
    path.startsWith('/i/navidad-') ||
    path.includes('navidad') ||
    path.includes('posada') ||
    path.includes('christmas');

  // Permitir la skin navideña si es el sitio público O si es una invitación de edición Navidad
  const isChristmasAllowed = isChristmasPath || isChristmasEventActive;
  const isExcluded = (!isChristmasAllowed && EXCLUDED_PREFIXES.some((p) => path.startsWith(p))) || path.startsWith('/dashboard');

  const isInvitationRoute = path.startsWith('/i/') || path.startsWith('/preview/') || path.startsWith('/invitacion/');

  const flakes = useMemo<Flake[]>(() => {
    return Array.from({ length: SNOWFLAKE_COUNT }, () => ({
      left: Math.random() * 100,
      size: 6 + Math.random() * 12,
      duration: 7 + Math.random() * 10,
      delay: Math.random() * 10,
      opacity: 0.4 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, []);

  useEffect(() => {
    writeEnabled(enabled);
    if (!enabled) setMusicOn(false);
  }, [enabled]);

  useEffect(() => {
    if (isExcluded && musicOn) {
      setMusicOn(false);
    }
  }, [isExcluded, musicOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn && !isExcluded) {
      audio.volume = 0.35;
      audio.play().catch(() => setMusicOn(false)); // autoplay bloqueado o sin archivo
    } else {
      audio.pause();
    }
  }, [musicOn, isExcluded]);

  // En las rutas excluidas no renderizamos nada (ni el botón).
  if (isExcluded) return null;

  return (
    <>
      <style>{`
        @keyframes invittoSnowFall {
          0%   { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(110vh) translateX(var(--drift, 0px)); }
        }
        @keyframes invittoTwinkle {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .invitto-xmas-flake {
          position: absolute;
          top: -10vh;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
          animation-name: invittoSnowFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .invitto-xmas-flake { animation: none; display: none; }
        }
      `}</style>

      {enabled && (
        <>
          {/* Nieve */}
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              zIndex: 9998,
            }}
          >
            {flakes.map((f, i) => (
              <span
                key={i}
                className="invitto-xmas-flake"
                style={{
                  left: `${f.left}%`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  opacity: f.opacity,
                  animationDuration: `${f.duration}s`,
                  animationDelay: `${f.delay}s`,
                  ['--drift' as string]: `${f.drift}px`,
                }}
              />
            ))}
          </div>

          {/* Guirnalda de luces rojas/verdes/doradas */}
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 9998,
              background:
                'linear-gradient(90deg, #c0392b, #27ae60, #c0392b, #27ae60, #c0392b)',
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const colors = ['#e74c3c', '#2ecc71', '#f1c40f'];
              const color = colors[i % colors.length];
              return (
                <span
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    marginTop: '4px',
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                    animation: `invittoTwinkle 1.8s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
              );
            })}
          </div>

          {/* Audio (opt-in, nunca autoplay) */}
          <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />
        </>
      )}

      {/* Controles flotantes (abajo-izquierda, elevado en preview móvil para no tapar barra de plantillas) */}
      <div
        className={`fixed left-4 flex gap-2 z-[9999] transition-all duration-300 ${
          isInvitationRoute ? 'bottom-28 sm:bottom-6 sm:left-6' : 'bottom-4 sm:bottom-6'
        }`}
      >
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          title={enabled ? 'Apagar modo navideño' : 'Encender modo navideño'}
          aria-label={enabled ? 'Apagar modo navideño' : 'Encender modo navideño'}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            background: enabled ? '#c0392b' : '#4b5563',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            opacity: enabled ? 1 : 0.7,
          }}
        >
          {enabled ? '🎄' : '🌲'}
        </button>

        {enabled && (
          <button
            type="button"
            onClick={() => setMusicOn((v) => !v)}
            title={musicOn ? 'Silenciar música' : 'Poner música navideña'}
            aria-label={musicOn ? 'Silenciar música' : 'Poner música navideña'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              background: musicOn ? '#27ae60' : '#4b5563',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          >
            {musicOn ? '🔊' : '🔈'}
          </button>
        )}
      </div>
    </>
  );
}
