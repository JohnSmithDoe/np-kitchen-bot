import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IQuickAddState } from '../../@types/types';
import { selectSettingsState } from '../settings/settings.selector';

export const selectQuickAddState =
  createFeatureSelector<IQuickAddState>('quickadd');

export const selectQuickAddCanAddLocal = createSelector(
  selectQuickAddState,
  selectSettingsState,
  (state, settings): boolean => !!state.canAddLocal && settings.showQuickAdd
);
export const selectQuickAddCanAddGlobal = createSelector(
  selectQuickAddState,
  selectSettingsState,
  (state, settings): boolean =>
    !!state.canAddGlobal && settings.showQuickAddGlobal
);
