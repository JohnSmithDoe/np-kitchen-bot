import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEditShoppingItemState, IStorageItem } from '../../@types/types';

export const selectEditShoppingState =
  createFeatureSelector<IEditShoppingItemState>('editShoppingItem');
export const selectEditShoppingItem = createSelector(
  selectEditShoppingState,
  (state): IStorageItem | undefined => state.item
);
