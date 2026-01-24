import { Competition, Fixture, Season } from '@/types';
import { create } from 'zustand';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export type StoreState = {
  competition: Competition | null;
  season: Season | null;
  fixtures: Fixture[];
  isLoadingFixtures: boolean;
  fetchFixtures: () => Promise<void>;
};

export const useFutStore = create<StoreState>((set) => ({
  competition: null,
  season: null,
  fixtures: [],
  isLoadingFixtures: true,
  fetchFixtures: async () => {
    try {
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
}));
