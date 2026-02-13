'use client';

import { Minus, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { PREDICTION_CONSTRAINTS } from '@/lib/constants/validation';
import { cn } from '@/lib/utils';
import { Fixture } from '@/types';

interface PredictionProps {
  matchId: Fixture['id'];
  initialHome?: number;
  initialAway?: number;
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
  initialHome = 0,
  initialAway = 0,
  isLocked = false,
}: PredictionProps) {
  const [homeScore, setHomeScore] = useState(initialHome);
  const [awayScore, setAwayScore] = useState(initialAway);

  const adjustScore = useCallback((currentScore: number, delta: number) => {
    return Math.max(
      PREDICTION_CONSTRAINTS.minScore,
      Math.min(PREDICTION_CONSTRAINTS.maxScore, currentScore + delta)
    );
  }, []);

  const handleHomeDecrease = useCallback(() => {
    if (!isLocked) setHomeScore((s) => adjustScore(s, -1));
  }, [isLocked, adjustScore]);

  const handleHomeIncrease = useCallback(() => {
    if (!isLocked) setHomeScore((s) => adjustScore(s, 1));
  }, [isLocked, adjustScore]);

  const handleAwayDecrease = useCallback(() => {
    if (!isLocked) setAwayScore((s) => adjustScore(s, -1));
  }, [isLocked, adjustScore]);

  const handleAwayIncrease = useCallback(() => {
    if (!isLocked) setAwayScore((s) => adjustScore(s, 1));
  }, [isLocked, adjustScore]);

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
          <button
            onClick={handleHomeDecrease}
            className={styles.button}
            aria-label="Decrease home team score"
            disabled={isLocked}
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className={cn(styles.score, homeWinning ? 'text-green-600' : 'text-black')}>
            {homeScore}
          </span>
          <button
            onClick={handleHomeIncrease}
            className={styles.button}
            aria-label="Increase home team score"
            disabled={isLocked}
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

        {/* DIVIDER */}
        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* AWAY TEAM */}
        <div className={`${styles.stepperBase} ${awayWinning ? 'bg-green-100' : ''}`}>
          <button
            onClick={handleAwayDecrease}
            className={styles.button}
            aria-label="Decrease away team score"
            disabled={isLocked}
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className={cn(styles.score, awayWinning ? 'text-green-600' : 'text-black')}>
            {awayScore}
          </span>
          <button
            onClick={handleAwayIncrease}
            className={styles.button}
            aria-label="Increase away team score"
            disabled={isLocked}
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
