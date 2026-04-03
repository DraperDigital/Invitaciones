import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Joyride, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GuidedTourProps {
  onComplete?: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const location = useLocation();
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) return;
      
      const tourKey = `tour_seen_${user.id}_${location.pathname.replace(/\//g, '_')}`;
      const hasSeenTour = localStorage.getItem(tourKey);

      if (hasSeenTour) {
        setRun(false);
        return;
      }

      // ONLY show if they have 0 events (New Account)
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!error && count === 0) {
        defineSteps();
        setRun(true);
      } else {
        setRun(false);
      }
    };

    checkEligibility();
  }, [location.pathname, user]);

  const defineSteps = () => {
    const path = location.pathname;
    let newSteps: any[] = [];

    // All tours start with a welcome/onboarding indicator
    const introStep = {
        target: 'body',
        content: (
            <div className="py-8 px-4 text-center bg-[#1B2E1D] rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <div className="p-5 bg-white/5 rounded-[2.5rem] border border-white/10 animate-bounce shadow-xl">
                        <PartyPopper className="h-10 w-10 text-[#BD7474]" />
                    </div>
                </div>
                <h3 className="text-3xl font-serif text-white mb-4 italic tracking-tight">¡Hola! Permítenos guiarte</h3>
                <p className="text-stone-300 text-sm font-light leading-relaxed max-w-[280px] mx-auto opacity-90">
                    Hemos preparado un breve recorrido para que aproveches al máximo esta sección de Invitto.
                </p>
                <div className="mt-10 flex justify-center gap-3">
                    <div className="h-1.5 w-10 bg-[#BD7474] rounded-full shadow-lg shadow-[#BD7474]/20"></div>
                    <div className="h-1.5 w-3 bg-white/10 rounded-full"></div>
                    <div className="h-1.5 w-3 bg-white/10 rounded-full"></div>
                </div>
            </div>
        ),
        placement: 'center' as const,
        styles: {
            options: {
                width: 450,
            },
            tooltip: {
                backgroundColor: '#1B2E1D',
                padding: 0,
                borderRadius: '32px',
                overflow: 'hidden'
            }
        }
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
      locale={{
        back: 'Atrás',
        close: 'Entendido',
        last: 'Finalizar Recorrido',
        next: 'Siguiente',
        skip: 'Saltar'
      }}
      styles={{
        options: {
          primaryColor: '#BD7474',
          arrowColor: '#1B2E1D',
          backgroundColor: '#1B2E1D',
          textColor: '#FFFFFF',
          zIndex: 10000,
          overlayColor: 'rgba(0, 0, 0, 0.6)',
        },
        tooltip: {
            backgroundColor: '#1B2E1D',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
        },
        tooltipContainer: {
          textAlign: 'center',
          color: '#FFFFFF',
        },
        buttonNext: {
            borderRadius: '14px',
            fontSize: '10px',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '2px',
            padding: '12px 24px',
            backgroundColor: '#BD7474',
            marginLeft: '10px',
            transition: 'all 0.2s ease-in-out'
        },
        buttonBack: {
            fontSize: '10px',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.4)',
            marginRight: '12px'
        },
        buttonSkip: {
            fontSize: '10px',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.3)',
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
