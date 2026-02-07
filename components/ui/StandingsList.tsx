'use client';

import { GroupTable } from './GroupTable';
import { Spinner } from './Spinner';
import { useStandings } from '@/hooks/queries/useStandings';

export function StandingsList() {
  const { data: standings, isLoading: isLoadingStandings, isError, error } = useStandings();

  if (isLoadingStandings) {
    return <Spinner className="mx-auto my-12 size-24 text-slate-300" />;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  if (!standings) {
    return <div className="text-center text-gray-500">No standings available</div>;
  }

  return (
    <div className="z-0 container flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {standings.map((stage) => (
        <div key={stage.group} className="flex-1 rounded-2xl border border-gray-200 bg-gray-50">
          <GroupTable group={stage.group} table={stage.table} />
        </div>
      ))}
    </div>
  );
}
