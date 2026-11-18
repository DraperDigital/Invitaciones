import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
    accentColor?: string;
}

export default function CinematicParallaxBackdrop({ accentColor = '#CCA461' }: Props) {
    const { scrollY } = useScroll();

    // Parallax depth movement for subtle background orbs
    const orb1Y = useTransform(scrollY, [0, 3000], [0, 260]);
    const orb2Y = useTransform(scrollY, [0, 3000], [0, -220]);
    const orb3Y = useTransform(scrollY, [0, 3000], [0, 180]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
            {/* ── 1. The Real Subtle Blue-Gray Textured Paper as Full-Site Background (#E1EAF2) ── */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{
                    backgroundImage: 'url(/images/subtle-blue-gray-paper.png)',
                    backgroundColor: '#E1EAF2',
                }}
            />

            {/* ── 2. Subtle Parallax Ambient Glows Matching the 5-Color Palette ── */}
            {/* Ambient Orb 1: Warm Gold / Ocre Accent (#CCA461) */}
            <motion.div
                style={{ y: orb1Y }}
                className="absolute -top-36 left-1/4 -translate-x-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] rounded-full blur-[140px] opacity-25"
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, rgba(204, 164, 97, 0.3) 50%, transparent 70%)` }}
                />
            </motion.div>

            {/* Ambient Orb 2: Warm Crema Soft Light (#FDF8F0) */}
            <motion.div
                style={{ y: orb2Y }}
                className="absolute top-[35%] -left-32 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-[130px] opacity-35"
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{ background: 'radial-gradient(circle, #FDF8F0 0%, rgba(253, 248, 240, 0.4) 50%, transparent 70%)' }}
                />
            </motion.div>

            {/* Ambient Orb 3: Sepia / Café Madera Warmth (#8D6B4F) */}
            <motion.div
                style={{ y: orb3Y }}
                className="absolute top-[60%] -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-[140px] opacity-15"
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{ background: 'radial-gradient(circle, #8D6B4F 0%, rgba(141, 107, 79, 0.3) 50%, transparent 70%)' }}
                />
            </motion.div>

            {/* ── 3. Ultra-soft Paper Vignette on Edges ── */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(74,68,62,0.06)]" />
        </div>
    );
}
