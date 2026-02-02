import { Fixture } from '@/types';
import { Card, CardContent, CardFooter } from './Card';
import { specialCharsToSpace } from '@/lib/helpers/specialCharsToSpace';

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
  return (
    <Card className="gap-3">
      <CardContent className="px-0">
        <div className="flex items-center justify-center gap-3 sm:gap-5 md:text-lg">
          <div className="flex flex-1 flex-wrap-reverse items-center justify-end gap-2">
            <span className="md:hidden">{homeTeam.code}</span>
            <span className="hidden md:block">{homeTeam.name}</span>
            {homeTeam.logo && (
              <img src={homeTeam.logo} alt={homeTeam.name} className="h-auto w-7 sm:w-8" />
            )}
          </div>
          <div className="text-center text-lg font-medium md:text-2xl">
            {new Date(match.date).toLocaleTimeString(undefined, {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="flex flex-1 items-center justify-start gap-2">
            {awayTeam.logo && (
              <img src={awayTeam.logo} alt={awayTeam.name} className="h-auto w-7 sm:w-8" />
            )}
            <span className="md:hidden">{awayTeam.code}</span>
            <span className="hidden md:block">{awayTeam.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-center text-xs tracking-widest capitalize">
        {specialCharsToSpace(match.stage!)}{' '}
        {match.group && ` - ${specialCharsToSpace(match.group || '')}`}
      </CardFooter>
    </Card>
  );
}
