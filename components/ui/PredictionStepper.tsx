'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionProps {
  matchId: string;
  initialHome?: number;
  initialAway?: number;
  onSave: (h: number, a: number) => void;
  isLocked?: boolean;
}

const styles = {
  root: cn('flex w-full flex-col items-center gap-1 border-t-2 pt-2'),
  button: cn(
    'flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm hover:text-green-500 active:scale-95'
  ),
  stepperBase: cn('flex items-center rounded-full transition-colors duration-300'),
  score: cn('w-8 text-center text-xl font-bold'),
};

export function PredictionStepper({
  matchId,
  initialHome = 0,
  initialAway = 0,
  onSave,
  isLocked = false,
}: PredictionProps) {
  const [homeScore, setHomeScore] = useState(initialHome);
  const [awayScore, setAwayScore] = useState(initialAway);
  const [isSaving, setIsSaving] = useState(false);
  const handleChange = (team: 'home' | 'away', delta: number) => {
    if (isLocked) return;
    if (team === 'home') setHomeScore(Math.max(0, Math.min(15, homeScore + delta)));
    if (team === 'away') setAwayScore(Math.max(0, Math.min(15, awayScore + delta)));
  };

  const homeWinning = homeScore > awayScore;
  const awayWinning = awayScore > homeScore;

  if (isLocked) {
    return (
      <div className="flex w-full justify-center border-t-2 pt-2">
        <span className="text-xs">
          Tu predicción: {homeScore} - {awayScore}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className="flex items-center gap-2">
        {/* LOCAL TEAM*/}
        <div className={cn(styles.stepperBase, homeWinning ? 'bg-green-100' : '')}>
          <button onClick={() => handleChange('home', -1)} className={styles.button}>
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className={cn(styles.score, homeWinning ? 'text-green-600' : 'text-black')}>
            {homeScore}
          </span>
          <button onClick={() => handleChange('home', 1)} className={styles.button}>
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

        {/* DIVIDER */}
        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* AWAY TEAM */}
        <div className={`${styles.stepperBase} ${awayWinning ? 'bg-green-100' : ''}`}>
          <button onClick={() => handleChange('away', -1)} className={styles.button}>
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className={cn(styles.score, awayWinning ? 'text-green-600' : 'text-black')}>
            {awayScore}
          </span>
          <button onClick={() => handleChange('away', 1)} className={styles.button}>
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
