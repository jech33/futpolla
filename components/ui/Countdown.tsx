'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useFixtures } from '@/hooks/queries/useFixtures';
import { APP_CONFIG } from '@/lib/constants/app';
import { calculateTimeUntil } from '@/lib/helpers/dateFormatter';
import { cn, containerClassName } from '@/lib/utils';

export function Countdown() {
  const { data: fixtures, isLoading } = useFixtures();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  const competition = fixtures?.[0]?.competition;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const updateCountdown = () => {
      setTimeLeft(calculateTimeUntil(APP_CONFIG.tournament.startDate));
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted || isLoading) return null;

  return (
    <div className="w-full bg-cyan-300 py-6">
      <div className={cn(containerClassName, 'flex justify-between gap-5 sm:gap-10')}>
        <div className="flex items-center">
          {competition && (
            <Image
              alt={competition.name || ''}
              src={competition.logo || ''}
              preload
              width={64}
              height={64}
              className="h-auto min-w-16"
            />
          )}
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
      <span className="text-center font-mono text-xl font-bold tracking-tight tabular-nums sm:text-3xl md:text-4xl">
        {formattedValue}
      </span>
      <span className="mt-2 text-center text-[10px] font-bold tracking-widest sm:min-w-9.5 md:min-w-11.5 md:text-xs">
        {label}
      </span>
    </div>
  );
}
