import { db } from '@/lib/firebase/config';
import { Fixture } from '@/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const getFixtures = async (): Promise<Fixture[]> => {
  const q = query(collection(db, 'competitions', 'wc-2026', 'matches'), orderBy('date', 'asc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Fixture[];
};
