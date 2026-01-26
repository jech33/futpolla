'use client';

import { useFutStore } from '@/stores/useFutStore';
import { cn, containerClassName } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TARGET_DATE = new Date('2026-06-11T13:00:00-06:00').getTime();

export function Countdown() {
  const competition = useFutStore((state) => state.competition);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted || !competition) return null;

  return (
    <div className="w-full bg-cyan-300 py-6">
      <div className={cn(containerClassName, 'flex justify-between gap-5 sm:gap-10')}>
        <div className="flex items-center">
          <Image
            alt={competition?.name || ''}
            src={competition?.logo || ''}
            preload
            width={64}
            height={64}
            className="h-auto min-w-16"
          />
          <div className="flex flex-col">
            <p className="hidden text-2xl font-bold sm:block lg:text-4xl">
              {competition?.name} 2026
            </p>
            <p className="hidden text-lg sm:block lg:text-xl">11 June - 19 July</p>
          </div>
        </div>
        <div className="flex gap-4 md:gap-6">
          <TimeBox value={timeLeft.days} label="days" />
          <TimeBox value={timeLeft.hours} label="hours" />
          <TimeBox value={timeLeft.minutes} label="mins" />
          <TimeBox value={timeLeft.seconds} label="secs" />
        </div>
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="font-mono text-xl font-bold tracking-tight tabular-nums sm:text-3xl md:text-4xl">
        {formattedValue}
      </span>
      <span className="mt-2 text-[10px] font-bold tracking-widest md:text-xs">{label}</span>
    </div>
  );
}
