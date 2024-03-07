import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IStorageState } from './storage.reducer';

export const selectStorageState =
  createFeatureSelector<IStorageState>('storage');

export const selectStorageList = createSelector(
  selectStorageState,
  (state) => state.items
);
