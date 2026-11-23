import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MOCK_EVENTS } from '../lib/mockData';
import { loadGoogleFonts } from '../lib/loadFonts';
import {
    STD_TEMPLATES, STD_FONTS, DEFAULT_STD_TEMPLATE,
    buildStdData, hasSaveTheDateAccess, getStdDemoEvent,
} from '../lib/saveTheDate';
import { STD_COMPONENTS } from '../components/std/SaveTheDateTemplates';

/**
 * /std/:slug — Save the Date de una sola pantalla.
 * /std/demo-<plantilla> — ejemplos públicos (con barra para cambiar de diseño).
 * ?t=<plantilla> — fuerza un diseño (vista previa desde el editor).
 */
export default function SaveTheDatePage() {
    const { slug = '' } = useParams();
    const [searchParams] = useSearchParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isDemo = slug.startsWith('demo-');

    useEffect(() => {
        let alive = true;
        const load = async () => {
            setLoading(true);
            setNotFound(false);
            if (isDemo) {
                const demo = getStdDemoEvent(slug.replace(/^demo-/, ''));
                if (alive) { setEvent(demo); setNotFound(!demo); setLoading(false); }
                return;
            }
            const decoded = decodeURIComponent(slug);
            let found: any = null;
            if (import.meta.env.VITE_SUPABASE_URL) {
                const { data } = await supabase
                    .from('events')
                    .select('*')
                    .or(`slug.eq."${slug}",slug.eq."${decoded}"`)
                    .maybeSingle();
                found = data;
            }
            if (!found) found = MOCK_EVENTS.find(e => e.slug === slug || e.slug === decoded) || null;
            if (alive) { setEvent(found); setNotFound(!found); setLoading(false); }
        };
        load();
        return () => { alive = false; };
    }, [slug, isDemo]);

    const cfg = event?.theme_config || {};
    const forced = searchParams.get('t');
    const templateId = (forced && STD_COMPONENTS[forced]) ? forced
        : (STD_COMPONENTS[cfg.save_the_date_theme] ? cfg.save_the_date_theme : DEFAULT_STD_TEMPLATE);
    const data = useMemo(() => (event ? buildStdData(event) : null), [event]);

    useEffect(() => { loadGoogleFonts(STD_FONTS[templateId] || []); }, [templateId]);
    useEffect(() => {
        if (data) document.title = `${data.kicker} · ${data.title}`;
    }, [data]);

    if (loading) {
        return <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', fontFamily: 'Inter, sans-serif', color: '#999' }}>Cargando…</div>;
    }

    if (notFound || !event || !data) {
        return <Message title="No encontramos este Save the Date" />;
    }

    // Vista previa del dueño (?t=…) siempre se ve; los invitados solo si está activo
    const canShow = isDemo || !!forced || hasSaveTheDateAccess(event);
    if (!canShow) {
        return <Message title="Este Save the Date todavía no está activo" sub="Pronto recibirás la fecha de este evento." />;
    }

    const Tpl = STD_COMPONENTS[templateId];
    const idx = STD_TEMPLATES.findIndex(t => t.id === templateId);
    const prev = STD_TEMPLATES[(idx - 1 + STD_TEMPLATES.length) % STD_TEMPLATES.length];
    const next = STD_TEMPLATES[(idx + 1) % STD_TEMPLATES.length];

    return (
        <>
            <div className={isDemo ? 'std-demo-wrap' : undefined}>
                <Tpl data={data} event={event} />
            </div>
            {isDemo && (
                <div className="std-demo-bar">
                    <Link to={`/std/demo-${prev.id}`} aria-label={`Anterior: ${prev.name}`}>‹</Link>
                    <span>{STD_TEMPLATES[idx]?.name} <small>{idx + 1}/{STD_TEMPLATES.length}</small></span>
                    <Link to={`/std/demo-${next.id}`} aria-label={`Siguiente: ${next.name}`}>›</Link>
                    <Link to="/planes" className="std-demo-cta">Lo quiero</Link>
                </div>
            )}
        </>
    );
}

function Message({ title, sub }: { title: string; sub?: string }) {
    return (
        <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif', background: '#f7f4ef', color: '#3a2e26' }}>
            <div>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{title}</p>
                {sub && <p style={{ marginTop: 8, color: '#8a7d70' }}>{sub}</p>}
                <Link to="/" style={{ display: 'inline-block', marginTop: 20, color: '#DF3B94', fontWeight: 600 }}>Ir a Invitto</Link>
            </div>
        </div>
    );
}
