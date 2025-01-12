"use client"
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';

const messages = [
  `✨ Welcome to Loenietns ${siteConfig.name} Store!`,
  '🎉 Free Shipping on Orders Over $50',
  '🌟 New Collections Arriving Weekly',
  `💝 Join Our ${siteConfig.name} Rewards Program`,
  '🎁 Special Offers: 20% Off Selected Items'
];

export function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary via-black to-black text-white py-2 overflow-hidden backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{
            x: 50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(8px)"
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              x: { type: "spring", stiffness: 100, damping: 15 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              filter: { duration: 0.3 }
            }
          }}
          exit={{
            x: -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(8px)",
            transition: {
              x: { type: "spring", stiffness: 100, damping: 15 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              filter: { duration: 0.2 }
            }
          }}
          className="text-center text-xs md:text-sm font-medium"
        >
          <motion.span
            initial={{ textShadow: "0 0 0px rgba(255,255,255,0)" }}
            animate={{
              textShadow: "0 0 8px rgba(255,255,255,0.5)",
              transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            {messages[currentIndex]}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
