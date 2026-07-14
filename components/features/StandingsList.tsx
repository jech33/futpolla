'use client';

import { DataLoader } from '@/components/ui/DataLoader';

import { useStandings } from '@/hooks/queries/useStandings';

import { GroupTable } from './GroupTable';

export function StandingsList() {
  const { data, isLoading, isError, error } = useStandings();

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyComponent={<div className="py-12 text-center text-gray-500">No standings available</div>}
    >
      {(standings) => (
        <div className="z-0 container flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {standings.map((stage) => (
            <div key={stage.group} className="flex-1 rounded-2xl border border-gray-200 bg-gray-50">
              <GroupTable group={stage.group} table={stage.table} />
            </div>
          ))}
        </div>
      )}
    </DataLoader>
  );
}
