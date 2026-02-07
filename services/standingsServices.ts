import { db } from '@/lib/firebase/config';
import { GroupTable } from '@/types';
import { collection, getDocs, query } from 'firebase/firestore';

export const getStandings = async () => {
  const q = query(collection(db, 'competitions', 'wc-2026', 'standings'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data()) as GroupTable[];
};
