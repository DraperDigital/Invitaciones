import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './NubeDeMiel.css';

/**
 * Nube de Miel — portada editorial tierna para baby shower / bautizo:
 * azul marino, azul cielo, crema y miel. Capítulo numerado, título serif con
 * palabra de acento en itálica, ilustraciones propias en acuarela
 * (/images/themes/nube/*.webp) y cuenta regresiva en tarjeta.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con NubeDeMiel.css bajo `.theme-nube-de-miel`.
 */

interface Props {
    event: any;
    cfg: any;
    countdown: any;
    labels: any;
    heroImageUrl: string | null;
    scrollToSection: (id: string) => void;
    onEditHero?: () => void;
}

const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');

export default function NubeDeMielHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const words = title.trim().split(/\s+/);
    const first = words[0] || '';
    const rest = words.slice(1).join(' ');
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`nm-hero ${shown ? 'is-shown' : ''}`}>
            <div className="nm-hero-top">
                <p className="nm-chapter">01 — El principio de nuestra historia</p>
                <p className="nm-italic-gold">{labels?.tagline || 'Hay un sueño en camino…'}</p>
                <h1 className="nm-name">
                    {first}
                    {rest && <em>{rest}</em>}
                </h1>
                {validDate && (
                    <p className="nm-when">
                        {format(eventDate!, "EEEE d 'de' MMMM · h:mm a", { locale: es })}
                    </p>
                )}
                {city && <p className="nm-city">{city}</p>}

                <img className="nm-lamb" src="/images/themes/nube/borreguito.webp" alt="" aria-hidden="true" />

                <button type="button" className="nm-btn-light" onClick={() => scrollToSection('rsvp')}>
                    Confirmar asistencia <span aria-hidden="true">→</span>
                </button>
            </div>

            {/* Curva hacia la sección clara */}
            <svg className="nm-wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 0 H400 V12 C300 44 100 44 0 12Z" fill="#0f2a4a" />
            </svg>

            <div className="nm-hero-bottom">
                {heroImageUrl && (
                    <div
                        className={`nm-photo ${onEditHero ? 'is-editable' : ''}`}
                        onClick={onEditHero}
                        title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                    >
                        <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                        {onEditHero && (
                            <span className="nm-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                        )}
                        <p className="nm-photo-caption">Con amor, mientras esperamos tu llegada</p>
                    </div>
                )}

                {showCountdown && (
                    <div className="nm-count-wrap">
                        <img className="nm-teddy" src="/images/themes/nube/osito-globos.webp" alt="" aria-hidden="true" />
                        <p className="nm-chapter nm-chapter-dark">Save the date</p>
                        <h2 className="nm-title">La magia está <em>por llegar.</em></h2>
                        <div className="nm-count" aria-label="Cuenta regresiva">
                            {[
                                { v: countdown.days, l: 'Días' },
                                { v: countdown.hours, l: 'Horas' },
                                { v: countdown.minutes, l: 'Minutos' },
                                { v: countdown.seconds, l: 'Segundos' },
                            ].map((it) => (
                                <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
