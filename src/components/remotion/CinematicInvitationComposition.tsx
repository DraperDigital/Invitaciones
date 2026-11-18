import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    AbsoluteFill,
    Sequence,
} from 'remotion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface CinematicProps {
    event: any;
    guest?: any;
    cfg?: any;
    labels?: any;
    heroImageUrl?: string | null;
    countdown?: { days: number; hours: number; minutes: number; seconds: number };
}

export const CinematicInvitationComposition: React.FC<CinematicProps> = ({
    event,
    guest,
    cfg = {},
    labels = {},
    heroImageUrl,
    countdown,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const accentGold = cfg?.accent_color || cfg?.accentColor || '#EAB308';
    const primaryBg = cfg?.heroBgColor || cfg?.hero_bg_color || '#070A12';
    const textColor = cfg?.hero_text_color || cfg?.heroTextColor || '#FFFFFF';

    const eventDate = event?.date_time ? new Date(event.date_time) : new Date();

    // Initials extraction or manual override
    const getMonogram = () => {
        if (cfg?.monogram || cfg?.monogram_text) return cfg.monogram || cfg.monogram_text;
        if (!event?.title) return 'E & C';
        const parts = event.title.split(/ y | & | Y | e | E /i);
        if (parts.length >= 2) {
            return `${parts[0].trim()[0]} & ${parts[1].trim()[0]}`;
        }
        return event.title.slice(0, 2).toUpperCase();
    };

    const introPhrase = cfg?.video_intro_phrase || 'Una invitación muy especial';
    const ctaText = cfg?.video_cta_text || 'Desliza para ver itinerario y RSVP ↓';

    // Subtitle / Celebration label
    const celebrationType =
        cfg?.subtitle ||
        labels?.welcome ||
        labels?.tagline ||
        (event?.event_type === 'wedding' || event?.event_type === 'boda'
            ? 'Nuestra Boda'
            : event?.event_type === 'xv'
            ? 'Mis XV Años'
            : event?.event_type === 'birthday' || event?.event_type === 'cumpleanos'
            ? 'Mi Cumpleaños'
            : event?.event_type === 'bautizo'
            ? 'Mi Bautizo'
            : 'Gran Celebración');

    // Dynamic background Ken Burns effect
    const bgScale = interpolate(frame, [0, 360], [1, 1.15], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const bgRotate = interpolate(frame, [0, 360], [-0.5, 0.5], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Ambient floating particles
    const particles = [
        { id: 1, x: 20, y: 30, size: 4, speed: 0.6, delay: 0 },
        { id: 2, x: 80, y: 20, size: 6, speed: 0.8, delay: 10 },
        { id: 3, x: 45, y: 70, size: 5, speed: 0.5, delay: 20 },
        { id: 4, x: 15, y: 80, size: 7, speed: 0.7, delay: 5 },
        { id: 5, x: 75, y: 65, size: 4, speed: 0.9, delay: 15 },
        { id: 6, x: 90, y: 40, size: 8, speed: 0.4, delay: 25 },
        { id: 7, x: 30, y: 50, size: 5, speed: 0.6, delay: 12 },
        { id: 8, x: 60, y: 85, size: 6, speed: 0.7, delay: 18 },
    ];

    return (
        <AbsoluteFill
            style={{
                backgroundColor: primaryBg,
                color: textColor,
                fontFamily: 'Playfair Display, Georgia, serif',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* ── Background Layer with Ambient Lighting & Photo ── */}
            {heroImageUrl ? (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `scale(${bgScale}) rotate(${bgRotate}deg)`,
                        transformOrigin: 'center center',
                    }}
                >
                    <img
                        src={heroImageUrl}
                        alt="Hero"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.38) contrast(1.1) saturate(1.15)',
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at 50% 30%, ${accentGold}22 0%, ${primaryBg} 70%)`,
                    }}
                />
            )}

            {/* Ambient Radial Vignette & Shimmer */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Glowing Golden Aura at Center */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${accentGold}28 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                    transform: `scale(${interpolate(Math.sin(frame / 20), [-1, 1], [0.9, 1.1])})`,
                    pointerEvents: 'none',
                }}
            />

            {/* Floating Bokeh Particles */}
            {particles.map((p) => {
                const particleY = (p.y - (frame * p.speed * 0.4)) % 100;
                const normY = particleY < 0 ? particleY + 100 : particleY;
                const opacity = interpolate(
                    Math.sin((frame + p.delay * 10) / 15),
                    [-1, 1],
                    [0.2, 0.85]
                );
                return (
                    <div
                        key={p.id}
                        style={{
                            position: 'absolute',
                            left: `${p.x}%`,
                            top: `${normY}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            borderRadius: '50%',
                            backgroundColor: accentGold,
                            opacity,
                            boxShadow: `0 0 12px ${accentGold}, 0 0 24px ${accentGold}88`,
                            pointerEvents: 'none',
                        }}
                    />
                );
            })}

            {/* Decorative Gold Border Frame */}
            <div
                style={{
                    position: 'absolute',
                    inset: '28px',
                    border: `1px solid ${accentGold}40`,
                    pointerEvents: 'none',
                    borderRadius: '8px',
                    boxShadow: `inset 0 0 20px ${accentGold}10`,
                }}
            >
                {/* Corner Accents */}
                <div style={{ position: 'absolute', top: -1, left: -1, width: 24, height: 24, borderTop: `3px solid ${accentGold}`, borderLeft: `3px solid ${accentGold}` }} />
                <div style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 24, borderTop: `3px solid ${accentGold}`, borderRight: `3px solid ${accentGold}` }} />
                <div style={{ position: 'absolute', bottom: -1, left: -1, width: 24, height: 24, borderBottom: `3px solid ${accentGold}`, borderLeft: `3px solid ${accentGold}` }} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 24, height: 24, borderBottom: `3px solid ${accentGold}`, borderRight: `3px solid ${accentGold}` }} />
            </div>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* SCENE 1: (Frames 0 - 95) The Monogram Entrance & Welcome        */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <Sequence from={0} durationInFrames={95}>
                {(() => {
                    const sceneSpring = spring({
                        frame,
                        fps,
                        config: { damping: 14, stiffness: 90 },
                    });
                    const sceneOpacity = interpolate(frame, [0, 15, 80, 95], [0, 1, 1, 0]);
                    const ringRotation = interpolate(frame, [0, 95], [0, 45]);

                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '40px',
                                opacity: sceneOpacity,
                                transform: `scale(${interpolate(sceneSpring, [0, 1], [0.85, 1])})`,
                                width: '100%',
                            }}
                        >
                            {/* Rotating Ring Monogram */}
                            <div
                                style={{
                                    position: 'relative',
                                    width: '180px',
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '32px',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        border: `2px dashed ${accentGold}88`,
                                        borderRadius: '50%',
                                        transform: `rotate(${ringRotation}deg)`,
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: '10px',
                                        border: `1px solid ${accentGold}`,
                                        borderRadius: '50%',
                                        boxShadow: `0 0 25px ${accentGold}44`,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '44px',
                                        letterSpacing: '4px',
                                        fontWeight: 400,
                                        color: accentGold,
                                        textShadow: `0 0 16px ${accentGold}aa`,
                                    }}
                                >
                                    {getMonogram()}
                                </span>
                            </div>

                            <p
                                style={{
                                    fontSize: '20px',
                                    letterSpacing: '8px',
                                    textTransform: 'uppercase',
                                    color: `${textColor}cc`,
                                    marginBottom: '14px',
                                    fontWeight: 300,
                                }}
                            >
                                {celebrationType}
                            </p>

                            <div
                                style={{
                                    width: '120px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${accentGold}, transparent)`,
                                    margin: '12px auto',
                                }}
                            />

                            <p
                                style={{
                                    fontSize: '17px',
                                    letterSpacing: '4px',
                                    fontStyle: 'italic',
                                    color: `${accentGold}dd`,
                                }}
                            >
                                {introPhrase}
                            </p>
                        </div>
                    );
                })()}
            </Sequence>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* SCENE 2: (Frames 90 - 185) Personalized VIP Guest Pass         */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <Sequence from={90} durationInFrames={95}>
                {(() => {
                    const localFrame = frame - 90;
                    const cardSpring = spring({
                        frame: localFrame,
                        fps,
                        config: { damping: 13, stiffness: 100 },
                    });
                    const sceneOpacity = interpolate(localFrame, [0, 15, 80, 95], [0, 1, 1, 0]);

                    const guestName = guest?.name;
                    const passes = (guest?.max_plus_ones ?? 0) + 1;

                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '32px',
                                opacity: sceneOpacity,
                                transform: `translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                                width: '100%',
                                maxWidth: '820px',
                            }}
                        >
                            {/* Golden Foil VIP Badge */}
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 24px',
                                    borderRadius: '999px',
                                    background: `linear-gradient(135deg, ${accentGold}22, ${accentGold}44)`,
                                    border: `1px solid ${accentGold}`,
                                    marginBottom: '28px',
                                    boxShadow: `0 0 20px ${accentGold}33`,
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>✨</span>
                                <span
                                    style={{
                                        fontSize: '14px',
                                        letterSpacing: '4px',
                                        textTransform: 'uppercase',
                                        color: accentGold,
                                        fontWeight: 600,
                                    }}
                                >
                                    {guestName ? 'Invitación Personalizada' : 'Pase de Honor'}
                                </span>
                                <span style={{ fontSize: '18px' }}>✨</span>
                            </div>

                            {/* Guest Name Card */}
                            <div
                                style={{
                                    background: 'rgba(15, 23, 42, 0.75)',
                                    backdropFilter: 'blur(16px)',
                                    border: `1.5px solid ${accentGold}66`,
                                    borderRadius: '24px',
                                    padding: '40px 32px',
                                    width: '100%',
                                    boxShadow: `0 20px 40px rgba(0,0,0,0.6), inset 0 0 30px ${accentGold}15`,
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '16px',
                                        letterSpacing: '5px',
                                        textTransform: 'uppercase',
                                        color: `${textColor}aa`,
                                        marginBottom: '16px',
                                    }}
                                >
                                    {guestName ? 'Tenemos el honor de invitar a:' : 'Esperamos contar con tu presencia'}
                                </p>

                                <h2
                                    style={{
                                        fontSize: '44px',
                                        lineHeight: 1.15,
                                        fontWeight: 500,
                                        color: textColor,
                                        marginBottom: '20px',
                                        textShadow: `0 0 24px ${accentGold}55`,
                                    }}
                                >
                                    {guestName || 'Apreciable Familia y Amigos'}
                                </h2>

                                {guestName && (
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            backgroundColor: `${accentGold}22`,
                                            border: `1px solid ${accentGold}55`,
                                            fontSize: '15px',
                                            color: accentGold,
                                            letterSpacing: '2px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Pase reservado para {passes} {passes === 1 ? 'persona' : 'personas'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </Sequence>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* SCENE 3: (Frames 180 - 275) Kinetic Event Title & Names         */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <Sequence from={180} durationInFrames={95}>
                {(() => {
                    const localFrame = frame - 180;
                    const titleSpring = spring({
                        frame: localFrame,
                        fps,
                        config: { damping: 12, stiffness: 80 },
                    });
                    const sceneOpacity = interpolate(localFrame, [0, 15, 80, 95], [0, 1, 1, 0]);
                    const letterSpacing = interpolate(localFrame, [0, 90], [2, 6]);

                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '36px',
                                opacity: sceneOpacity,
                                width: '100%',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '18px',
                                    letterSpacing: '6px',
                                    textTransform: 'uppercase',
                                    color: accentGold,
                                    marginBottom: '20px',
                                    fontWeight: 400,
                                }}
                            >
                                {celebrationType}
                            </p>

                            <h1
                                style={{
                                    fontSize: '56px',
                                    lineHeight: 1.1,
                                    fontWeight: 400,
                                    letterSpacing: `${letterSpacing}px`,
                                    color: textColor,
                                    marginBottom: '28px',
                                    textShadow: `0 4px 30px rgba(0,0,0,0.8), 0 0 40px ${accentGold}40`,
                                    transform: `scale(${interpolate(titleSpring, [0, 1], [0.85, 1])})`,
                                    maxWidth: '900px',
                                }}
                            >
                                {event?.title || 'Celebración Especial'}
                            </h1>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginTop: '8px',
                                }}
                            >
                                <div style={{ width: 40, height: 1, backgroundColor: `${accentGold}88` }} />
                                <span
                                    style={{
                                        fontSize: '22px',
                                        letterSpacing: '3px',
                                        fontStyle: 'italic',
                                        color: `${textColor}ee`,
                                    }}
                                >
                                    {format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}
                                </span>
                                <div style={{ width: 40, height: 1, backgroundColor: `${accentGold}88` }} />
                            </div>
                        </div>
                    );
                })()}
            </Sequence>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* SCENE 4: (Frames 270 - 360) Venue, Countdown & CTA             */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <Sequence from={270} durationInFrames={90}>
                {(() => {
                    const localFrame = frame - 270;
                    const venueSpring = spring({
                        frame: localFrame,
                        fps,
                        config: { damping: 14, stiffness: 90 },
                    });
                    const sceneOpacity = interpolate(localFrame, [0, 15, 80, 90], [0, 1, 1, 0.7]);

                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '32px',
                                opacity: sceneOpacity,
                                transform: `translateY(${interpolate(venueSpring, [0, 1], [30, 0])}px)`,
                                width: '100%',
                            }}
                        >
                            <span style={{ fontSize: '32px', marginBottom: '12px' }}>📍</span>

                            <h3
                                style={{
                                    fontSize: '32px',
                                    color: accentGold,
                                    fontWeight: 500,
                                    marginBottom: '8px',
                                    letterSpacing: '2px',
                                }}
                            >
                                {event?.venue_name || 'Lugar de la Celebración'}
                            </h3>

                            {event?.venue_address && (
                                <p
                                    style={{
                                        fontSize: '18px',
                                        color: `${textColor}cc`,
                                        maxWidth: '650px',
                                        marginBottom: '28px',
                                        fontWeight: 300,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {event.venue_address}
                                </p>
                            )}

                            {/* Countdown preview pills */}
                            {countdown && (
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '14px',
                                        marginBottom: '32px',
                                    }}
                                >
                                    {[
                                        { label: 'DÍAS', val: countdown.days },
                                        { label: 'HRS', val: countdown.hours },
                                        { label: 'MIN', val: countdown.minutes },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                border: `1px solid ${accentGold}40`,
                                                borderRadius: '12px',
                                                padding: '12px 18px',
                                                minWidth: '70px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 600,
                                                    color: accentGold,
                                                }}
                                            >
                                                {String(item.val).padStart(2, '0')}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '11px',
                                                    letterSpacing: '2px',
                                                    color: `${textColor}99`,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 22px',
                                    borderRadius: '999px',
                                    background: `linear-gradient(90deg, ${accentGold}33, ${accentGold}55)`,
                                    border: `1px solid ${accentGold}`,
                                    color: accentGold,
                                    fontSize: '14px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    boxShadow: `0 0 20px ${accentGold}33`,
                                }}
                            >
                                {ctaText}
                            </div>
                        </div>
                    );
                })()}
            </Sequence>
        </AbsoluteFill>
    );
};
