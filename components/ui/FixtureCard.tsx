import { Fixture } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { specialCharsToSpace } from '@/lib/helpers/specialCharsToSpace';
import { PredictionStepper } from './PredictionStepper';
import { Clock } from 'lucide-react';

type FixtureCardProps = {
  match: Fixture;
};

export function FixtureCard({ match }: FixtureCardProps) {
  const homeTeam = {
    name: match.homeTeam?.name || 'TBD',
    code: match.homeTeam?.code || 'TBD',
    logo: match.homeTeam?.logo || null,
  };
  const awayTeam = {
    name: match.awayTeam?.name || 'TBD',
    code: match.awayTeam?.code || 'TBD',
    logo: match.awayTeam?.logo || null,
  };

  const fixtureTime = new Date(match.date).toLocaleTimeString(undefined, {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <Card className="gap-3 pt-3 pb-2">
      <CardHeader className="flex w-full items-center justify-between px-3 text-[11px] tracking-widest capitalize">
        <span className="flex items-center">
          <Clock size={12} className="mr-2 inline-block" /> {fixtureTime}
        </span>
        <span>{match.group && `${specialCharsToSpace(match.group || '')}`}</span>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="flex items-center justify-center gap-3 sm:gap-5 md:text-lg">
          <div className="flex flex-1 flex-wrap-reverse items-center justify-end gap-2">
            <span className="md:hidden">{homeTeam.code}</span>
            <span className="hidden md:block">{homeTeam.name}</span>
            {homeTeam.logo && (
              <img src={homeTeam.logo} alt={homeTeam.name} className="h-auto w-7 sm:w-8" />
            )}
          </div>
          <div className="text-center text-lg font-medium md:text-2xl">VS</div>
          <div className="flex flex-1 items-center justify-start gap-2">
            {awayTeam.logo && (
              <img src={awayTeam.logo} alt={awayTeam.name} className="h-auto w-7 sm:w-8" />
            )}
            <span className="md:hidden">{awayTeam.code}</span>
            <span className="hidden md:block">{awayTeam.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center px-0 text-center text-xs tracking-widest capitalize">
        <PredictionStepper matchId={match.id} onSave={() => {}} isLocked={false} />
      </CardFooter>
    </Card>
  );
}
