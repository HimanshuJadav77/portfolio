'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/helpers';

export function CalloutBanner({ className }: { className?: string }) {
  return (
    <section className={cn('py-12 sm:py-20 bg-background text-center overflow-hidden', className)}>
      <div className="container-narrow max-w-4xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-foreground leading-tight"
        >
          A STANDARD OF PERFORMANCE & LOW-LATENCY ARCHITECTURE
        </motion.p>
      </div>
    </section>
  );
}
