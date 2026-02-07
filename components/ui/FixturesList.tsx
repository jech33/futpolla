'use client';

import { FixtureCard } from './FixtureCard';
import { Spinner } from './Spinner';
import { useFixtures } from '@/hooks/queries/useFixtures';

export function FixturesList() {
  const { data: fixtures, isLoading: isLoadingFixtures, isError, error } = useFixtures();

  if (isLoadingFixtures) {
    return <Spinner className="mx-auto my-12 size-24 text-slate-300" />;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  if (!fixtures) {
    return <div className="text-center text-gray-500">No fixtures available</div>;
  }

  return (
    <div className="space-y-4">
      {fixtures.map((match, index) => {
        const matchDate = new Date(match.date);
        const currentDate = matchDate.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
        });
        const previousDate =
          index > 0
            ? new Date(fixtures[index - 1].date).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
              })
            : null;
        const shouldRenderDate = currentDate !== previousDate;
        return (
          <div key={match.id}>
            {shouldRenderDate && (
              <h2 className="mt-8 pb-2 text-start text-lg">
                {matchDate.toLocaleDateString('en-US', {
                  dateStyle: 'full',
                })}
              </h2>
            )}
            <FixtureCard match={match} />
          </div>
        );
      })}
    </div>
  );
}
