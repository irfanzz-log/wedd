'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function calculateTimeLeft() {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
        <>
            <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="transform-gpu relative py-28 px-6 bg-[url(/g6.jpeg)] bg-center bg-cover text-center">
         
          <div className='absolute w-full h-full bg-black/40 z-10 top-0 left-0 inset-0'></div>
          <div className='relative z-20 mb-10'>
            <h2 className=" font-serif mb-5 text-neutral-100 text-xl">Hitung Mundur</h2>
            <p className='font-great-vibes font-bold text-[#FFDBFD] font-bold text-5xl'>Menuju Hari Bahagia</p>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto z-20">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                key={item.label}
                className="transform-gpu rounded-3xl p-10 border border-neutral-100 backdrop-blur-[2px]"
              >
                <h3 className="text-5xl font-bold text-[#FFDBFD] mb-2">
                  {item.value}
                </h3>

                <p className="text-neutral-100 uppercase tracking-widest text-sm">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        </>
  )}