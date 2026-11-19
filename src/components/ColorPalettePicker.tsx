import { useState, useMemo } from 'react';
import { X, Check, Sparkles, ArrowRight, Palette as PaletteIcon } from 'lucide-react';
import {
    PRESET_COLOR_PALETTES,
    generatePaletteFromColor,
    type ColorPalette
} from '../lib/colorPalettes';

interface ColorPalettePickerProps {
    isOpen: boolean;
    onClose: () => void;
    activePaletteId?: string;
    currentThemeConfig: Record<string, any>;
    eventType?: string;
    onSelectPalette: (palette: ColorPalette) => void;
    onResetOriginal: () => void;
    onGoToDetailDesign?: () => void;
}

export default function ColorPalettePicker({
    isOpen,
    onClose,
    activePaletteId,
    currentThemeConfig,
    eventType = 'boda',
    onSelectPalette,
    onResetOriginal,
    onGoToDetailDesign,
}: ColorPalettePickerProps) {
    if (!isOpen) return null;

    // Detect if current theme_config has any custom color overrides
    const hasColorOverrides = Boolean(
        currentThemeConfig.accent_color ||
        currentThemeConfig.accentColor ||
        currentThemeConfig.button_color ||
        currentThemeConfig.buttonColor ||
        currentThemeConfig.section_bg_color ||
        currentThemeConfig.sectionBgColor ||
        currentThemeConfig.color_palette_id
    );

    // Initial color for the custom color picker
    const initialCustomColor = (
        currentThemeConfig.custom_accent_base ||
        currentThemeConfig.accent_color ||
        currentThemeConfig.accentColor ||
        '#C5A059'
    );
    const [customColor, setCustomColor] = useState<string>(initialCustomColor);

    // Label based on event type
    const weddingOrEventLabel = useMemo(() => {
        const t = (eventType || '').toLowerCase();
        if (t.includes('boda')) return 'de mi boda';
        if (t.includes('xv') || t.includes('quince')) return 'de mis XV años';
        if (t.includes('bautizo')) return 'de mi bautizo';
        if (t.includes('cumple')) return 'de mi cumpleaños';
        return 'de mi evento';
    }, [eventType]);

    // Dynamic palette generated from custom color
    const dynamicPalette = useMemo(() => {
        return generatePaletteFromColor(customColor, `Los colores ${weddingOrEventLabel}`);
    }, [customColor, weddingOrEventLabel]);

    const handleCustomColorChange = (newColor: string) => {
        setCustomColor(newColor);
        const palette = generatePaletteFromColor(newColor, `Los colores ${weddingOrEventLabel}`);
        onSelectPalette(palette);
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Panel Container (Bottom sheet on mobile, centered modal on desktop) */}
            <div className="relative w-full md:max-w-xl max-h-[88vh] bg-white rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-stone-100">
                {/* Mobile Drag Indicator */}
                <div className="md:hidden flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1 bg-stone-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-stone-50/80 via-white to-stone-50/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DF3B94] to-[#C52A7C] text-white flex items-center justify-center shadow-md shadow-[#DF3B94]/20">
                            <PaletteIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                                Paletas de Color
                            </h3>
                            <p className="text-[11px] text-stone-500 font-medium">
                                Cambia la atmósfera completa de tu invitación en vivo
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    
                    {/* SECTION 1: "Los colores de mi boda / evento" */}
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/60 via-stone-50 to-pink-50/40 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[#C5A059]" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                                    Los colores {weddingOrEventLabel}
                                </h4>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#DF3B94] bg-[#fdf2f8] px-2.5 py-0.5 rounded-full border border-[#fbcfe8]">
                                Automático
                            </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            Elige el color protagonista y generaremos una paleta equilibrada (60-30-10) con contraste garantizado en textos y botones.
                        </p>

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-3">
                                {/* Color picker circle wrapper */}
                                <div className="relative group cursor-pointer">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-2 ring-stone-200 transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: customColor }}
                                    />
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        title="Toca para elegir tu color"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Tu Color</span>
                                    <span className="font-mono text-xs font-bold text-stone-800 uppercase">{customColor}</span>
                                </div>
                            </div>

                            {/* Live derived preview circles */}
                            <div className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-xl border border-stone-200/60 shadow-2xs">
                                {dynamicPalette.previewCircles.map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs shrink-0"
                                        style={{ backgroundColor: color }}
                                        title={`Tono ${idx + 1}: ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: 10 Paletas Prediseñadas */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                Paletas de Autor (10)
                            </h4>
                            <span className="text-[10px] text-stone-400">Regla 60-30-10</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {PRESET_COLOR_PALETTES.map((palette) => {
                                // Detection of active state
                                const isSelected = palette.isOriginal
                                    ? !hasColorOverrides
                                    : (activePaletteId === palette.id || currentThemeConfig.color_palette_id === palette.id);

                                return (
                                    <button
                                        key={palette.id}
                                        type="button"
                                        onClick={() => {
                                            if (palette.isOriginal) {
                                                onResetOriginal();
                                            } else {
                                                onSelectPalette(palette);
                                            }
                                        }}
                                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-2.5 ${
                                            isSelected
                                                ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                                : 'bg-white hover:bg-stone-50/80 border-stone-200 hover:border-stone-300 shadow-xs'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-serif font-bold text-stone-900 text-sm leading-tight truncate">
                                                    {palette.name}
                                                </p>
                                                <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-normal">
                                                    {palette.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                                    <Check className="h-3 w-3 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Color preview circles */}
                                        <div className="flex items-center gap-2 pt-0.5">
                                            {palette.isOriginal ? (
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/60">
                                                    Original de la plantilla
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    {palette.previewCircles.map((circleColor, cIdx) => (
                                                        <div
                                                            key={cIdx}
                                                            className="w-5 h-5 rounded-full border border-black/10 shadow-2xs shrink-0 transition-transform group-hover:scale-110"
                                                            style={{ backgroundColor: circleColor }}
                                                            title={circleColor}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Footer Link: "Personalizar a detalle →" */}
                <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between shrink-0">
                    <p className="text-xs text-stone-500">
                        ¿Quieres afinar cada color individualmente?
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            if (onGoToDetailDesign) onGoToDetailDesign();
                        }}
                        className="text-xs font-bold text-[#DF3B94] hover:text-[#C52A7C] transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
                    >
                        <span>Personalizar a detalle</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
