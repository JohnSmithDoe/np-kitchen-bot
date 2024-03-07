import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGlobalsState } from './globals.reducer';

export const selectGlobalsState =
  createFeatureSelector<IGlobalsState>('globals');

export const selectGlobalsList = createSelector(
  selectGlobalsState,
  (state) => state.items
);
