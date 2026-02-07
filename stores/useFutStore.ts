import { create } from 'zustand';

export type StoreState = {};

export const useFutStore = create<StoreState>((set) => ({}));
