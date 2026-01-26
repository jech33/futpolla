'use client';

import { useEffect } from 'react';
import { FixtureCard } from './FixtureCard';
import { useFutStore } from '@/stores/useFutStore';
import { Spinner } from './Spinner';

export function FixturesList() {
  const fixtures = useFutStore((state) => state.fixtures);
  const isLoadingFixtures = useFutStore((state) => state.isLoadingFixtures);
  const fetchFixtures = useFutStore((state) => state.fetchFixtures);

  useEffect(() => {
    fetchFixtures();
  }, []);

  return (
    <>
      {isLoadingFixtures ? (
        <Spinner className="mx-auto my-12 size-24 text-slate-300" />
      ) : (
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
      )}
    </>
  );
}
