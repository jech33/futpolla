'use client';

import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase/config';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Fixture } from '@/types';
import { seedMatches } from './seeds';

export default function MatchSeeder() {
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(matches);

  // Función temporal para poblar la DB (bórrala antes de producción)
  const seedDB = async () => {
    const dummyMatches: Fixture[] = seedMatches;

    try {
      for (const m of dummyMatches) {
        await addDoc(collection(db, 'matches'), m);
      }
      alert('✅ Database seeded! Refresh the page.');
    } catch (error) {
      console.error('Error seeding:', error);
      alert('❌ Error seeding DB');
    }
  };

  // Cargar partidos al montar
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const q = query(collection(db, 'matches'), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Fixture[];
        setMatches(data);
      } catch (e) {
        console.error('Error fetching matches:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);
  return (
    <div className="mx-auto max-w-md">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tighter text-green-400">FUTPOLLA</h1>
        {/* Botón temporal solo visible si no hay partidos */}
        {matches.length === 0 && (
          <button
            onClick={seedDB}
            className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-400 hover:bg-slate-700"
          >
            Seed DB
          </button>
        )}
      </header>

      {loading ? (
        <p className="animate-pulse text-center text-slate-500">Loading fixture...</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg"
            >
              <div className="mb-1 text-center text-xs tracking-widest text-slate-500 uppercase">
                {match.homeTeam.code} - {match.awayTeam.code} •{' '}
                {new Date(match.date).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center text-lg font-bold">{match.homeTeam.name}</div>
                <div className="mx-2 rounded bg-slate-800 px-2 py-1 text-xs text-slate-400">VS</div>
                <div className="flex-1 text-center text-lg font-bold">{match.awayTeam.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
