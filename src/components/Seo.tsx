import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://invitto.com.mx';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

interface SeoProps {
    /** Page-specific title. The site name is appended automatically. */
    title: string;
    /** 50-160 chars. Shown in SERPs and social previews. */
    description: string;
    /** Path relative to the site root, e.g. "/planes". Used for canonical + og:url. */
    path: string;
    /** Optional absolute URL of the social preview image. Falls back to the site logo. */
    image?: string;
    /** Optional JSON-LD object(s) to inject as <script type="application/ld+json">. */
    jsonLd?: object | object[];
    /** Mark page as noindex (e.g. dashboards, drafts). */
    noindex?: boolean;
}

export default function Seo({ title, description, path, image, jsonLd, noindex }: SeoProps) {
    const fullTitle = title.includes('Invitto') ? title : `${title} | Invitto`;
    const canonical = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_OG_IMAGE;
    const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Invitto" />
            <meta property="og:locale" content="es_MX" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {jsonLdArray.map((data, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}
        </Helmet>
    );
}
