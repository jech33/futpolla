import { Competition, Fixture, GroupTable, Season } from '@/types';
import { create } from 'zustand';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export type StoreState = {
  competition: Competition | null;
  season: Season | null;
  fixtures: Fixture[];
  isLoadingFixtures: boolean;
  standings: GroupTable[];
  isLoadingStandings: boolean;
  fetchFixtures: () => Promise<void>;
  fetchStandings: () => Promise<void>;
};

export const useFutStore = create<StoreState>((set) => ({
  competition: null,
  season: null,
  fixtures: [],
  isLoadingFixtures: true,
  standings: [],
  isLoadingStandings: true,

  fetchFixtures: async () => {
    try {
      set({ isLoadingFixtures: true });
      const q = query(collection(db, 'competitions', 'wc-2026', 'matches'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Fixture[];
      set({ fixtures: data });
      set({ competition: data[0]?.competition || null });
    } catch (e) {
      console.error('Error fetching matches:', e);
    } finally {
      set({ isLoadingFixtures: false });
    }
  },

  fetchStandings: async () => {
    try {
      set({ isLoadingStandings: true });
      const q = query(collection(db, 'competitions', 'wc-2026', 'standings'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data()) as any[];
      set({ standings: data });
    } catch (e) {
      console.error('Error fetching standings:', e);
    } finally {
      set({ isLoadingStandings: false });
    }
  },
}));
