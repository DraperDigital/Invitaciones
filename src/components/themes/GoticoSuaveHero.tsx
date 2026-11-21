import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';
import { getHeroImageStyle } from '../../lib/heroImagePosition';
import './GoticoSuave.css';

/**
 * Gótico Suave — portada collage "flat lay" en negro, marfil y carmesí sobre
 * papel tapiz de damasco: sobre negro con forro de flores oscuras, polaroid,
 * tarjeta marfil con esquinas barrocas y tarjeta carmesí con sello de lacre.
 *
 * Solo dibuja la PORTADA (módulo `hero`, que incluye la cuenta regresiva).
 * El resto de los módulos se visten con GoticoSuave.css bajo `.theme-gotico-suave`.
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

function splitNames(title: string): [string, string] {
    const m = title.split(/\s*&\s*|\s+y\s+/i).map((p) => p.trim()).filter(Boolean);
    return m.length >= 2 ? [m[0], m.slice(1).join(' ')] : [title, ''];
}

export default function GoticoSuaveHero({ event, cfg, countdown, labels, heroImageUrl, scrollToSection, onEditHero }: Props) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShown(true), 150);
        return () => clearTimeout(t);
    }, []);

    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = eventDate && !isNaN(eventDate.getTime());
    const title: string = event?.title || '';
    const [nameA, nameB] = splitNames(title);
    const city = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);

    return (
        <section id="hero" className={`gs-hero ${shown ? 'is-shown' : ''}`}>
            <div className="gs-hero-inner">
                {/* Sobre negro con forro de flores */}
                <div className="gs-env" aria-hidden="true">
                    <div className="gs-env-liner" />
                    <div className="gs-env-front" />
                </div>

                {/* Polaroid con la foto */}
                {heroImageUrl && (
                    <div
                        className={`gs-polaroid ${onEditHero ? 'is-editable' : ''}`}
                        onClick={onEditHero}
                        title={onEditHero ? 'Haz clic para cambiar foto de portada' : undefined}
                    >
                        <div className="gs-polaroid-photo">
                            <img src={heroImageUrl} alt="" style={getHeroImageStyle(cfg)} />
                            {onEditHero && (
                                <span className="gs-edit"><Edit2 className="h-4 w-4" /> Cambiar foto</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Tarjeta marfil con esquinas barrocas */}
                <div className="gs-card gs-ivory">
                    <h1 className="gs-names">
                        <span className="gs-name-a">{nameA}</span>
                        {nameB && <span className="gs-name-b"><i>&amp;</i> {nameB}</span>}
                    </h1>
                    <p className="gs-sub">{labels?.tagline || 'Nuestra boda'}</p>
                    {validDate && (
                        <p className="gs-date">{format(eventDate!, "d MMMM", { locale: es })}</p>
                    )}
                    {city && <p className="gs-city">{city}</p>}

                    {showCountdown && (
                        <div className="gs-count" aria-label="Cuenta regresiva">
                            <p className="gs-count-label">Solo faltan</p>
                            <div className="gs-count-grid">
                                {[
                                    { v: countdown.days, l: 'Días' },
                                    { v: countdown.hours, l: 'Horas' },
                                    { v: countdown.minutes, l: 'Min' },
                                    { v: countdown.seconds, l: 'Seg' },
                                ].map((it) => (
                                    <div key={it.l}><b>{pad(it.v)}</b><small>{it.l}</small></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="button" className="gs-btn" onClick={() => scrollToSection('rsvp')}>
                        Confirmar asistencia
                    </button>
                </div>

                {/* Tarjeta carmesí con nombres en relieve y sello */}
                <div className="gs-crimson-card" aria-hidden="true">
                    <p className="gs-emboss">
                        <span>{nameA}</span>
                        {nameB && <span className="gs-emboss-b"><i>&amp;</i> {nameB}</span>}
                    </p>
                    <span className="gs-seal" />
                </div>

                <p className="gs-scroll">Desliza<i /></p>
            </div>
        </section>
    );
}
