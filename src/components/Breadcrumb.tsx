import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';

const SITE_URL = 'https://invitto.com.mx';

export interface BreadcrumbItem {
    /** Display label */
    label: string;
    /** Relative path, e.g. "/planes". Omit for the current (last) crumb. */
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    /** Visual variant; defaults to "light" for cream backgrounds. */
    variant?: 'light' | 'dark';
}

/**
 * Renders a breadcrumb trail with semantic markup + Schema.org BreadcrumbList
 * JSON-LD for rich snippets in Google SERPs.
 *
 * The "Inicio" (home) crumb is added automatically; pass only the deeper levels.
 *
 * Example:
 *   <Breadcrumb items={[
 *     { label: 'Ejemplos', href: '/ejemplos' },
 *     { label: 'Bodas' }  // current page — no href
 *   ]} />
 */
export default function Breadcrumb({ items, variant = 'light' }: BreadcrumbProps) {
    const allItems: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }, ...items];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            ...(item.href && { item: `${SITE_URL}${item.href}` }),
        })),
    };

    const textColor = variant === 'dark' ? 'text-white/60' : 'text-stone-400';
    const linkHover = variant === 'dark' ? 'hover:text-white' : 'hover:text-[#222B38]';
    const sepColor = variant === 'dark' ? 'text-white/30' : 'text-stone-300';
    const currentColor = variant === 'dark' ? 'text-white' : 'text-[#222B38]';

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>
            <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
                <ol className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                    {allItems.map((item, i) => {
                        const isLast = i === allItems.length - 1;
                        return (
                            <li key={i} className="flex items-center gap-1.5 md:gap-2">
                                {i > 0 && (
                                    <ChevronRight className={`h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0 ${sepColor}`} aria-hidden="true" />
                                )}
                                {isLast || !item.href ? (
                                    <span className={`font-medium ${currentColor}`} aria-current="page">
                                        {i === 0 && <Home className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden="true" />}
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link to={item.href} className={`${textColor} ${linkHover} transition-colors`}>
                                        {i === 0 && <Home className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden="true" />}
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
