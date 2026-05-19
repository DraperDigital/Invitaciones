import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Extraer el slug del formato /i/:slug
  const invitationMatch = path.match(/^\/i\/([^/]+)/);
  if (!invitationMatch) {
    return; // Si no coincide, dejar que Netlify continúe con el comportamiento por defecto
  }

  const slug = invitationMatch[1];

  // Obtener credenciales de Supabase de las variables de entorno
  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  // Fallbacks de metadatos por si falla la base de datos o el evento no existe
  let title = "Invitto — Invitación Digital";
  let description = "Estás invitado a nuestro evento especial. Ver detalles aquí.";
  let imageUrl = "https://invitto.com.mx/logo.png"; // Imagen por defecto
  let eventDetails: any = null;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      // Petición REST directa a Supabase para máxima velocidad
      // Solicitamos los datos del evento necesarios para el preview y para el cuerpo indexable
      const response = await fetch(
        `${supabaseUrl}/rest/v1/events?slug=eq.${slug}&select=title,event_type,theme_config,date_time,venue_name,venue_address,dress_code,rsvp_deadline`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const events = await response.json();
        if (events && events.length > 0) {
          const event = events[0];
          title = event.title || title;

          const cfg = event.theme_config || {};
          const heroImageUrl = cfg.hero_image_url || cfg.heroImageUrl;
          if (heroImageUrl) {
            imageUrl = heroImageUrl;
          }

          // Generar descripción adaptada según el tipo de evento
          const type = event.event_type || "default";
          const templates: Record<string, string> = {
            wedding: "Te invitamos a acompañarnos a celebrar nuestra boda. ¡Confirma tu asistencia aquí!",
            xv: "Te invito a celebrar mis XV años conmigo. ¡No faltes, confirma tu asistencia aquí!",
            birthday: "Te invito a mi fiesta de cumpleaños. ¡Te espero, confirma tu asistencia aquí!",
            baptism: "Te invitamos a acompañarnos a la celebración de mi bautizo. Confirma tu asistencia aquí.",
            graduation: "Te invito a celebrar mi graduación escolar. Confirma tu asistencia aquí.",
          };
          
          description = cfg.subtitle || cfg.welcome_message || templates[type] || templates.default;

          // Guardamos el objeto event para poder inyectarlo en el body
          eventDetails = event;
        }
      }
    } catch (error) {
      console.error("[Edge Function Error] Error al conectar con Supabase:", error);
    }
  }

  // Continuar la petición para obtener el HTML original de la app
  const response = await context.next();
  const html = await response.text();

  // 1. Reemplazar la etiqueta <title>
  let modifiedHtml = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // 2. Reemplazar o inyectar la metaetiqueta description
  const hasDescription = /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i.test(modifiedHtml);
  if (hasDescription) {
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${description}" />`
    );
  } else {
    modifiedHtml = modifiedHtml.replace(
      /<\/head>/i,
      `<meta name="description" content="${description}" />\n</head>`
    );
  }

  // 3. Inyectar etiquetas Open Graph, Twitter Cards y Robots noindex
  // noindex es importante en /i/* para que Google no indexe páginas privadas con nombres de invitados
  const ogTags = `
    <!-- Dynamic Open Graph Tags injected by Netlify Edge Function -->
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url.href}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  modifiedHtml = modifiedHtml.replace(/<\/head>/i, `${ogTags}\n</head>`);

  // 4. Inyectar el contenido del evento en el body (dentro de <div id="root">)
  // Esto permite que scrapers de IA (como Claude o ChatGPT) puedan leer el texto de la invitación
  if (eventDetails) {
    const formattedDate = eventDetails.date_time 
      ? new Date(eventDetails.date_time).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })
      : "";
    const formattedDeadline = eventDetails.rsvp_deadline
      ? new Date(eventDetails.rsvp_deadline).toLocaleDateString("es-MX", { dateStyle: "long", timeZone: "UTC" })
      : "";

    const eventBody = `
      <!-- SEO Fallback Content for Crawlers & AI Scrapers (Replaced by React on mount) -->
      <div class="seo-event-fallback" style="display: none;">
        <h1>${title}</h1>
        <p>${description}</p>
        <h2>Detalles del Evento</h2>
        <ul>
          <li><strong>Tipo de evento:</strong> ${eventDetails.event_type || "Celebración"}</li>
          ${formattedDate ? `<li><strong>Fecha y Hora:</strong> ${formattedDate}</li>` : ""}
          ${eventDetails.venue_name ? `<li><strong>Lugar:</strong> ${eventDetails.venue_name}</li>` : ""}
          ${eventDetails.venue_address ? `<li><strong>Dirección:</strong> ${eventDetails.venue_address}</li>` : ""}
          ${eventDetails.dress_code ? `<li><strong>Código de vestimenta:</strong> ${eventDetails.dress_code}</li>` : ""}
          ${formattedDeadline ? `<li><strong>Fecha límite de confirmación (RSVP):</strong> ${formattedDeadline}</li>` : ""}
        </ul>
      </div>
    `;

    // Reemplazamos el div#root genérico con el div#root personalizado de este evento
    modifiedHtml = modifiedHtml.replace(
      /<div\s+id=["']root["']>([\s\S]*?)<\/div>/i,
      `<div id="root">${eventBody}</div>`
    );
  }

  // Retornar la respuesta modificada con los headers originales
  return new Response(modifiedHtml, {
    headers: response.headers,
  });
};
