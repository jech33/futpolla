'use client';

import { useEffect } from 'react';
import { useFutStore } from '@/stores/useFutStore';
import { GroupTable } from './GroupTable';
import { Spinner } from './Spinner';

export function StandingsList() {
  const standings = useFutStore((state) => state.standings);
  const isLoadingStandings = useFutStore((state) => state.isLoadingStandings);
  const fetchStandings = useFutStore((state) => state.fetchStandings);

  useEffect(() => {
    fetchStandings();
  }, []);

  if (isLoadingStandings && standings.length === 0) {
    return <Spinner className="mx-auto my-12 size-24 text-slate-300" />;
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
