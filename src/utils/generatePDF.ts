import type { Event } from '../types/database.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateInvitationPDF = (event: Event) => {
    // Crear una ventana nueva para el PDF
    const printWindow = window.open('', '', 'width=800,height=600');

    if (!printWindow) {
        throw new Error('popup_blocked');
    }

    const eventDate = new Date(event.date_time);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${event.title} - Invitación</title>
            <style>
                @page {
                    margin: 2cm;
                    size: A4;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Georgia, 'Times New Roman', serif;
                    color: #1c1917;
                    line-height: 1.6;
                    background: white;
                    padding: 40px;
                    max-width: 700px;
                    margin: 0 auto;
                }
                
                .invitation-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 30px;
                    border-bottom: 2px solid #d4af37;
                }
                
                .event-type {
                    font-size: 14px;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    color: #d4af37;
                    margin-bottom: 20px;
                }
                
                .event-title {
                    font-size: 36px;
                    font-weight: 300;
                    margin-bottom: 10px;
                    color: #1c1917;
                }
                
                .divider {
                    width: 100px;
                    height: 1px;
                    background: #d4af37;
                    margin: 20px auto;
                }
                
                .section {
                    margin-bottom: 35px;
                    page-break-inside: avoid;
                }
                
                .section-title {
                    font-size: 20px;
                    color: #d4af37;
                    margin-bottom: 15px;
                    font-weight: 400;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                
                .info-block {
                    background: #fafaf9;
                    padding: 20px;
                    border-left: 3px solid #d4af37;
                    margin-bottom: 15px;
                }
                
                .info-label {
                    font-size: 12px;
                    color: #78716c;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }
                
                .info-value {
                    font-size: 16px;
                    color: #1c1917;
                    font-weight: 500;
                }
                
                .message {
                    text-align: center;
                    font-style: italic;
                    color: #57534e;
                    font-size: 15px;
                    padding: 30px 20px;
                    background: #fafaf9;
                    border-radius: 8px;
                }
                
                .itinerary-item {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e7e5e4;
                }
                
                .itinerary-time {
                    font-weight: bold;
                    color: #d4af37;
                    min-width: 80px;
                }
                
                .itinerary-event {
                    flex: 1;
                }
                
                .footer-note {
                    text-align: center;
                    margin-top: 50px;
                    padding-top: 30px;
                    border-top: 1px solid #e7e5e4;
                    font-size: 12px;
                    color: #78716c;
                }
                
                .qr-placeholder {
                    width: 120px;
                    height: 120px;
                    border: 2px dashed #d4af37;
                    margin: 20px auto;
                    display: flex;
                    align-items: center;
                    justify-center;
                    color: #78716c;
                    font-size: 11px;
                }

                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="invitation-header">
                <div class="event-type">${getEventTypeLabel(event.event_type)}</div>
                <h1 class="event-title">${event.title}</h1>
                <div class="divider"></div>
            </div>

            <!-- Fecha y Hora -->
            <div class="section">
                <h2 class="section-title">Fecha y Hora</h2>
                <div class="info-block">
                    <div class="info-label">Día</div>
                    <div class="info-value">
                        ${format(eventDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </div>
                </div>
                <div class="info-block">
                    <div class="info-label">Hora</div>
                    <div class="info-value">
                        ${format(eventDate, 'HH:mm', { locale: es })} hrs
                    </div>
                </div>
            </div>

            <!-- Ubicación -->
            ${event.venue_name ? `
            <div class="section">
                <h2 class="section-title">Ubicación</h2>
                <div class="info-block">
                    <div class="info-label">Lugar</div>
                    <div class="info-value">${event.venue_name}</div>
                </div>
                ${event.venue_address ? `
                <div class="info-block">
                    <div class="info-label">Dirección</div>
                    <div class="info-value">${event.venue_address}</div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- Dress Code -->
            ${event.dress_code ? `
            <div class="section">
                <h2 class="section-title">Código de Vestimenta</h2>
                <div class="info-block">
                    <div class="info-value">${event.dress_code}</div>
                </div>
            </div>
            ` : ''}

            <!-- Itinerario -->
            ${event.theme_config?.schedule ? `
            <div class="section">
                <h2 class="section-title">Itinerario</h2>
                ${event.theme_config.schedule.map((item: any) => `
                    <div class="itinerary-item">
                        <div class="itinerary-time">${item.time}</div>
                        <div class="itinerary-event">
                            <strong>${item.event}</strong>
                            ${item.location ? `<br><span style="color: #78716c;">${item.location}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- RSVP -->
            ${event.rsvp_deadline ? `
            <div class="section">
                <h2 class="section-title">Confirmación de Asistencia</h2>
                <div class="info-block">
                    <div class="info-label">Confirmar antes del</div>
                    <div class="info-value">
                        ${format(new Date(event.rsvp_deadline), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Mensaje -->
            <div class="message">
                "Será un honor compartir este día especial contigo"
            </div>

            <!-- Footer -->
            <div class="footer-note">
                Invitación generada digitalmente · ${event.title}
                <br>
                Para más información visita tu invitación digital
            </div>

            <script>
                // Auto-abrir diálogo de impresión
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                        // Cerrar ventana después de imprimir (opcional)
                        // window.onafterprint = () => window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const generateQRAsPDF = (event: Event, guestName: string, qrDataUrl: string) => {
    const printWindow = window.open('', '', 'width=600,height=800');
    if (!printWindow) {
        throw new Error('popup_blocked');
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                @page { margin: 0; size: 10cm 15cm; }
                body {
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: #FDFBF7;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: #1B2E1D;
                    text-align: center;
                }
                .card {
                    background: white;
                    padding: 40px;
                    border-radius: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid #E7E5E4;
                    width: 80%;
                }
                .label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: #BD7474;
                    margin-bottom: 20px;
                    font-weight: 800;
                }
                .guest-name {
                    font-family: Georgia, serif;
                    font-size: 24px;
                    margin-bottom: 30px;
                    font-style: italic;
                }
                .qr-container {
                    padding: 20px;
                    background: white;
                    border: 1px solid #F5F5F4;
                    border-radius: 20px;
                    margin-bottom: 30px;
                    display: inline-block;
                }
                .qr-image {
                    width: 200px;
                    height: 200px;
                }
                .event-title {
                    font-size: 12px;
                    color: #78716C;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="label">Pase de Acceso</div>
                <div class="guest-name">${guestName || 'Invitado Especial'}</div>
                <div class="qr-container">
                    <img src="${qrDataUrl}" class="qr-image" />
                </div>
                <div class="event-title">${event.title}</div>
            </div>
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

// Helper function para etiquetas de tipo de evento
const getEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'wedding': 'Boda',
        'xv': 'XV Años',
        'birthday': 'Cumpleaños',
        'bautizo': 'Bautizo',
        'graduacion': 'Graduación',
        'comunion': 'Primera Comunión',
        'corporate': 'Evento Corporativo',
        'other': 'Celebración Especial'
    };
    return labels[type] || 'Invitación';
};
