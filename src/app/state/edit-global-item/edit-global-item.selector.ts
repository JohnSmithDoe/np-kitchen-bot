import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEditGlobalItemState, IGlobalItem } from '../../@types/types';

export const selectEditGlobalState =
  createFeatureSelector<IEditGlobalItemState>('editGlobalItem');
export const selectEditGlobalItem = createSelector(
  selectEditGlobalState,
  (state): IGlobalItem | undefined => state.item
);
