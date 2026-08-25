import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Joyride, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { PartyPopper, X, ChevronRight } from 'lucide-react';

// Custom Tooltip Component for premium UI/UX
const TooltipComponent = ({
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: any) => {
  const isIntro = index === 0;

  if (isIntro) {
    return (
      <div 
        {...tooltipProps} 
        className="relative bg-[#1B2E1D] text-white rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-8 md:p-10 max-w-[440px] text-center font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Decorative highlights */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#BD7474]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close/Skip button at top right */}
        <button 
          {...skipProps} 
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5"
          title="Saltar recorrido"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Welcome Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 animate-bounce shadow-xl relative group">
            <div className="absolute inset-0 bg-[#BD7474]/20 rounded-[2rem] blur-xl opacity-50" />
            <PartyPopper className="h-10 w-10 text-[#BD7474] relative z-10" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-serif text-white mb-4 italic tracking-tight">
          ¡Hola! Permítenos guiarte
        </h3>

        {/* Body Description */}
        <p className="text-stone-300 text-sm font-light leading-relaxed max-w-[320px] mx-auto opacity-90 mb-8">
          Hemos preparado un breve recorrido para que aproveches al máximo esta sección de Invitto.
        </p>

        {/* Footer controls */}
        <div className="flex flex-col gap-5 pt-4 border-t border-white/5">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            <div className="h-1.5 w-8 bg-[#BD7474] rounded-full shadow-lg shadow-[#BD7474]/20 transition-all duration-300" />
            <div className="h-1.5 w-2 bg-white/10 rounded-full transition-all duration-300" />
            <div className="h-1.5 w-2 bg-white/10 rounded-full transition-all duration-300" />
            <div className="h-1.5 w-2 bg-white/10 rounded-full transition-all duration-300" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-4 mt-2">
            <button 
              {...skipProps} 
              className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/5"
            >
              Saltar
            </button>
            <button 
              {...primaryProps} 
              className="flex-1 bg-[#BD7474] hover:bg-[#A35D5D] active:scale-[0.98] text-white text-[10px] uppercase font-black tracking-[0.2em] py-4 px-6 rounded-2xl shadow-xl shadow-[#BD7474]/10 hover:shadow-[#BD7474]/20 transition-all flex items-center justify-center gap-2"
            >
              Empezar <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Step Tooltip (Spotlight description popups)
  return (
    <div 
      {...tooltipProps} 
      className="relative bg-[#1B2E1D] text-white rounded-[2rem] border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] p-6 max-w-[320px] font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Sleek highlights */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] uppercase font-black tracking-widest text-[#BD7474] bg-[#BD7474]/10 px-2.5 py-1 rounded-full border border-[#BD7474]/20">
          Paso {index + 1}
        </span>
        <button 
          {...skipProps} 
          className="text-white/35 hover:text-white transition-colors text-[9px] uppercase font-black tracking-wider"
        >
          Saltar
        </button>
      </div>

      {/* Content description */}
      <div className="text-stone-200 text-xs font-light leading-relaxed mb-5">
        {step.content}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        {/* Progress indicator dots */}
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index 
                  ? 'w-4 bg-[#BD7474]' 
                  : 'w-1 bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button 
              {...backProps} 
              className="text-[9px] uppercase font-black tracking-widest text-white/50 hover:text-white transition-colors py-2 px-2.5 rounded-lg hover:bg-white/5"
            >
              Atrás
            </button>
          )}
          <button 
            {...primaryProps} 
            className="bg-[#BD7474] hover:bg-[#A35D5D] active:scale-[0.97] text-white text-[9px] uppercase font-black tracking-widest py-2.5 px-4 rounded-xl shadow-lg shadow-[#BD7474]/15 hover:shadow-[#BD7474]/25 transition-all"
          >
            {isLastStep ? 'Entendido' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface GuidedTourProps {
  onComplete?: () => void;
  onDismiss?: () => void;
  hasEvents?: boolean;
  hasPlan?: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const location = useLocation();
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) return;

      // Only run when explicitly requested via `?tour=true`. Auto-trigger on
      // empty account was removed because the dashboard empty state and the
      // onboarding banner already guide new users — three overlapping prompts
      // were creating noise.
      const params = new URLSearchParams(location.search);
      if (params.get('tour') !== 'true') {
        setRun(false);
        return;
      }

      const tourKey = `tour_seen_${user.id}_${location.pathname.replace(/\//g, '_')}`;
      const hasSeenTour = localStorage.getItem(tourKey);

      if (hasSeenTour) {
        setRun(false);
        return;
      }

      defineSteps();
      setRun(true);
    };

    checkEligibility();
  }, [location.pathname, location.search, user]);

  const defineSteps = () => {
    const path = location.pathname;
    let newSteps: any[] = [];

    // All tours start with a welcome/onboarding indicator
    const introStep = {
        target: 'body',
        content: 'Hemos preparado un breve recorrido para que aproveches al máximo esta sección de Invitto.',
        placement: 'center' as const,
    };

    if (path === '/dashboard' || path === '/dashboard/') {
      newSteps = [
        introStep,
        {
          target: '#total-events-card',
          content: 'Bienvenido a tu resumen principal. Aquí verás el total de celebraciones activas.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '#new-event-btn',
          content: '¿Tienes una nueva celebración? Comienza creando una invitación premium desde aquí.',
          placement: 'left',
        },
        {
            target: '#recent-events-list',
            content: 'Aquí aparecerán tus invitaciones más recientes para un acceso rápido y gestión inmediata.',
            placement: 'top',
        }
      ];
    } else if (path === '/dashboard/rsvps') {
      newSteps = [
        introStep,
        {
          target: '#metrics-bar',
          content: 'Este es el Panel de Control. Mira cuántos invitados han confirmado en tiempo real.',
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '#tab-switcher',
          content: 'Organización total: cambia entre la Lista General, los Mensajes y la Gestión de Mesas.',
          placement: 'bottom',
        },
        {
          target: '#manage-mode-btn',
          content: '¿Necesitas corregir un nombre? Activa este modo para editar directamente.',
          placement: 'left',
        },
        {
          target: '#header-export-btn',
          content: 'Genera el PDF o CSV para tu banquetero con un clic.',
          placement: 'left',
        }
      ];
    } else if (path === '/dashboard/events') {
        newSteps = [
            introStep,
            {
                target: '#events-grid',
                content: 'Aquí tienes tu colección completa de invitaciones diseñadas.',
                placement: 'top',
                disableBeacon: true,
            }
        ];
    } else if (path === '/dashboard/settings') {
        newSteps = [
            introStep,
            {
                target: '#settings-card',
                content: 'Configura tu perfil, cambia tu contraseña y gestiona tus funciones premium.',
                placement: 'top',
                disableBeacon: true,
            }
        ];
    } else if (path === '/dashboard/new') {
        newSteps = [
            introStep,
            {
                target: '#wizard-container',
                content: 'Estás en el creador inteligente. Sigue los pasos para tener tu invitación lista.',
                placement: 'top',
                disableBeacon: true,
            }
        ];
    }

    setSteps(newSteps);
  };

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      const tourKey = `tour_seen_${location.pathname.replace(/\//g, '_')}`;
      localStorage.setItem(tourKey, 'true');
      setRun(false);
      if (onComplete) onComplete();
    }
  };

  const JoyrideComponent = Joyride as any;

  return (
    <JoyrideComponent
      steps={steps}
      run={run}
      continuous={true}
      showProgress={false}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={TooltipComponent}
      locale={{
        back: 'Atrás',
        close: 'Entendido',
        last: 'Finalizar Recorrido',
        next: 'Siguiente',
        skip: 'Saltar'
      }}
      styles={{
        options: {
          zIndex: 10000,
          overlayColor: 'rgba(27, 46, 29, 0.75)', // Elegant branded forest-green overlay
        },
        spotlight: {
            borderRadius: '24px',
            padding: '10px'
        }
      }}
    />
  );
};

export default GuidedTour;
