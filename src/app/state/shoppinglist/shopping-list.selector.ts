import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IShoppinglistsState } from './shopping-lists.reducer';

export const selectShoppinglistState =
  createFeatureSelector<IShoppinglistsState>('shoppinglist');

export const selectShoppingList = createSelector(
  selectShoppinglistState,
  (state) => state.items
);
