import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEditStorageItemState, IStorageItem } from '../../@types/types';

export const selectEditStorageState =
  createFeatureSelector<IEditStorageItemState>('editStorageItem');

export const selectEditStorageItem = createSelector(
  selectEditStorageState,
  (state): IStorageItem | undefined => state.item
);
