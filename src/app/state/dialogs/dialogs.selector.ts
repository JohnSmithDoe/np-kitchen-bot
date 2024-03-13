import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IEditGlobalItemState,
  IEditShoppingItemState,
  IEditStorageItemState,
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
} from '../../@types/types';

export const selectEditStorageState =
  createFeatureSelector<IEditStorageItemState>('dialogs');

export const selectEditStorageItem = createSelector(
  selectEditStorageState,
  (state): IStorageItem | undefined => state.item
);
export const selectEditGlobalState =
  createFeatureSelector<IEditGlobalItemState>('dialogs');

export const selectEditGlobalItem = createSelector(
  selectEditGlobalState,
  (state): IGlobalItem | undefined => state.item
);
export const selectEditShoppingState =
  createFeatureSelector<IEditShoppingItemState>('dialogs');

export const selectEditShoppingItem = createSelector(
  selectEditShoppingState,
  (state): IShoppingItem | undefined => state.item
);
