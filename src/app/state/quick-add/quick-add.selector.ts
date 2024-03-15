import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IQuickAddState } from '../../@types/types';
import { matchingTxt } from '../../app.utils';
import { selectSettingsState } from '../settings/settings.selector';

export const selectQuickAddState =
  createFeatureSelector<IQuickAddState>('quickadd');

export const selectQuickAddCanAddLocal = createSelector(
  selectQuickAddState,
  selectSettingsState,
  (state, settings): boolean =>
    !!matchingTxt(state.searchQuery ?? '')?.length &&
    !state.exactMatchLocal &&
    settings.showQuickAdd
);
export const selectQuickAddCanAddGlobal = createSelector(
  selectQuickAddState,
  selectQuickAddCanAddLocal,
  selectSettingsState,
  (state, canAddLocal, settings): boolean =>
    canAddLocal &&
    !!state.searchQuery?.length &&
    state.color !== 'global' &&
    !state.exactMatchGlobal &&
    settings.showQuickAddGlobal
);
