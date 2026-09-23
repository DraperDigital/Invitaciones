import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    yOffset?: number;
}

export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    yOffset = 20,
}: ScrollRevealProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.22, 1, 0.36, 1], // Apple-style smooth easeOutQuint
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
