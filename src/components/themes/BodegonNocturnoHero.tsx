import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './BodegonNocturno.css';

/**
 * Bodegón Nocturno — portada de lujo: columna de papel de algodón sobre una
 * pintura floral oscura (estilo bodegón holandés), sello de cera dorado,
 * nombres en caligrafía con florituras, fecha en versalitas y foto enmarcada.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * La columna de papel y el resto de los módulos se visten con
 * BodegonNocturno.css bajo `.theme-bodegon-nocturno`.
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

function monogram(title: string) {
    const parts = title.split(/&| y /i).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return (title.trim()[0] || '').toUpperCase();
}

export default function BodegonNocturnoHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 120);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`bn-hero ${shown ? 'is-shown' : ''}`}>
            <div className="bn-seal" aria-hidden="true"><span>{monogram(title)}</span></div>

            <h1 className="bn-names">{title}</h1>

            <p className="bn-kicker">{labels?.tagline || 'Nuestra boda'}</p>
            {validDate && (
                <p className="bn-date">{format(eventDate!, "MMMM d 'de' yyyy", { locale: es })}</p>
            )}

            {heroImageUrl && (
                <div
                    className={`bn-photo ${onEditHero ? 'is-editable' : ''}`}
                    onClick={onEditHero}
                    title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                >
                    <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                    {onEditHero && (
                        <span className="bn-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                    )}
                </div>
            )}

            {showCountdown && (
                <div className="bn-count" aria-label="Cuenta regresiva">
                    <p className="bn-script bn-count-title">Solo faltan</p>
                    <div className="bn-count-grid">
                        {[
                            { v: countdown.days, l: 'Días' },
                            { v: countdown.hours, l: 'Horas' },
                            { v: countdown.minutes, l: 'Minutos' },
                            { v: countdown.seconds, l: 'Segundos' },
                        ].map((it, i) => (
                            <div key={it.l} className="bn-count-cell">
                                <b>{pad(it.v)}</b>
                                <small>{it.l}</small>
                                {i < 3 && <i aria-hidden="true">:</i>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button type="button" className="bn-link" onClick={() => scrollToSection('rsvp')}>
                Confirmar asistencia
            </button>
        </section>
    );
}
