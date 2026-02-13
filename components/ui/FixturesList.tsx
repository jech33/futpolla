'use client';

import { useFixtures } from '@/hooks/queries/useFixtures';
import { formatDate, groupFixturesByDate } from '@/lib/helpers/dateFormatter';

import { DataLoader } from './DataLoader';
import { FixtureCard } from './FixtureCard';

export function FixturesList() {
  const { data, isLoading, isError, error } = useFixtures();

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyComponent={<div className="py-12 text-center text-gray-500">No fixtures available</div>}
    >
      {(fixtures) => {
        const groupedFixtures = groupFixturesByDate(fixtures);

        return (
          <div className="space-y-4">
            {groupedFixtures.map(({ date, matches }) => {
              const firstMatch = matches[0];
              if (!firstMatch) return null;

              return (
                <div key={date}>
                  <h2 className="mt-8 pb-2 text-start text-lg">{formatDate(firstMatch.date)}</h2>
                  <div className="space-y-5">
                    {matches.map((match) => (
                      <FixtureCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    </DataLoader>
  );
}
