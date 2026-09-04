import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
    url: string;
    caption?: string;
}

interface PhotoGalleryProps {
    images: GalleryImage[];
    title?: string;
    subtitle?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
    images, 
    title = "Nuestra Galería", 
    subtitle = "Momentos inolvidables compartidos con amor." 
}) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleNext = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length);
        }
    };

    const handlePrev = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length);
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <section id="gallery" className="py-20 md:py-24 bg-[var(--section-bg)] text-[var(--text-primary)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm text-accent mb-2">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-light tracking-wide text-[var(--text-primary)]">{title}</h2>
                    <p className="text-[var(--text-secondary)] font-light italic max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
                    {images.map((img, index) => (
                        <div 
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] border-4 md:border-8 border-white dark:border-stone-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] bg-[var(--card-bg)] transform transition-all duration-500 hover:scale-[1.02]"
                            onClick={() => setSelectedImage(index)}
                        >
                            <img 
                                src={img.url} 
                                alt={img.caption || `Gallery image ${index + 1}`} 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                    <Maximize2 className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                            </div>
                            {img.caption && (
                                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-3 md:p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-xl md:rounded-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-0.5">Recuerdo</p>
                                    <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] line-clamp-2">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 transition-all duration-300 animate-in fade-in">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white transition-colors p-3 rounded-full bg-white/10 hover:bg-white/20 z-10"
                        title="Cerrar"
                    >
                        <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                className="absolute left-3 sm:left-8 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center text-white/70 hover:text-white transition-all bg-white/10 hover:bg-white/20 rounded-full z-10"
                                title="Anterior"
                            >
                                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>

                            <button 
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="absolute right-3 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center text-white/70 hover:text-white transition-all bg-white/10 hover:bg-white/20 rounded-full z-10"
                                title="Siguiente"
                            >
                                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                        </>
                    )}

                    <div className="max-w-4xl w-full flex flex-col items-center gap-4 sm:gap-6">
                        <img 
                            src={images[selectedImage].url} 
                            alt={images[selectedImage].caption || `Gallery ${selectedImage + 1}`} 
                            className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl md:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                        {images[selectedImage].caption && (
                            <div className="text-center space-y-1 max-w-lg px-4">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">MOMENTO COMPARTIDO</p>
                                <p className="text-lg sm:text-2xl font-serif text-white">{images[selectedImage].caption}</p>
                            </div>
                        )}
                        <p className="text-white/40 text-xs tracking-widest uppercase font-mono">
                            {selectedImage + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PhotoGallery;
