'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
}

export function AnimatedCounter({ value, duration = 2, suffix = "" }: AnimatedCounterProps) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    React.useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, { duration });
            return () => controls.stop();
        }
    }, [isInView, count, value, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}
