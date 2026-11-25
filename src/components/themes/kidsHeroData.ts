/** Datos comunes de las portadas infantiles (nombre, edad, fecha, lugar, cuenta regresiva). */
export function kidsHeroData(event: any, cfg: any, countdown: any, fallbackName = 'Festejada') {
    const eventDate = event?.date_time ? new Date(event.date_time) : null;
    const validDate = !!eventDate && !isNaN(eventDate.getTime());
    const name: string = cfg?.child_name || cfg?.childName
        || (event?.title || '').replace(/^(cumpleaños|cumple|mi cumpleaños)\s*(de\s*)?/i, '').trim()
        || fallbackName;
    const age = cfg?.age || cfg?.turning_age;
    const placeName: string = event?.venue_name || '';
    const placeAddress: string = event?.venue_address || '';
    const showCountdown = cfg?.showCountdown !== false && cfg?.show_countdown !== false && countdown
        && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0);
    const pad = (n: number) => String(Math.max(0, n || 0)).padStart(2, '0');
    const countItems = countdown ? [
        { v: String(countdown.days ?? 0), l: 'Días' },
        { v: pad(countdown.hours), l: 'Horas' },
        { v: pad(countdown.minutes), l: 'Min' },
        { v: pad(countdown.seconds), l: 'Seg' },
    ] : [];
    return { eventDate: validDate ? eventDate! : null, name, age, placeName, placeAddress, showCountdown, countItems };
}
