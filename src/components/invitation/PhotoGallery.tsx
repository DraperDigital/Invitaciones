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
        <section id="gallery" className="py-24 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#BD7474]/10 text-[#BD7474] mb-4">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1B2E1D]">{title}</h2>
                    <p className="text-stone-400 font-light italic max-w-xl mx-auto">{subtitle}</p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img, index) => (
                        <div 
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transform transition-all duration-700 hover:scale-[1.02]"
                            onClick={() => setSelectedImage(index)}
                        >
                            <img 
                                src={img.url} 
                                alt={img.caption || `Gallery image ${index}`} 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#1B2E1D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <Maximize2 className="h-6 w-6" />
                                </div>
                            </div>
                            {img.caption && (
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BD7474] mb-1">CAPTION</p>
                                    <p className="font-serif text-[#1B2E1D]">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div className="fixed inset-0 z-[100] bg-[#1B2E1D]/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-4"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button 
                        onClick={handlePrev}
                        className="absolute left-8 h-20 w-20 flex items-center justify-center text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <button 
                        onClick={handleNext}
                        className="absolute right-8 h-20 w-20 flex items-center justify-center text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="max-w-5xl w-full flex flex-col items-center gap-8">
                        <img 
                            src={images[selectedImage].url} 
                            alt={images[selectedImage].caption} 
                            className="max-h-[70vh] w-full object-contain rounded-[2rem] shadow-2xl animate-in zoom-in duration-500"
                        />
                        {images[selectedImage].caption && (
                            <div className="text-center space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#BD7474]">MOMENTO COMPARTIDO</p>
                                <p className="text-3xl font-serif text-white">{images[selectedImage].caption}</p>
                            </div>
                        )}
                        <p className="text-white/30 text-xs tracking-widest uppercase">
                            {selectedImage + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PhotoGallery;
