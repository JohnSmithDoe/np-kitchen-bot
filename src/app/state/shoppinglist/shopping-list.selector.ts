import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ISearchResult,
  IShoppingItem,
  IShoppingState,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';

export const selectShoppinglistState =
  createFeatureSelector<IShoppingState>('shoppinglist');

export const selectShoppingList = createSelector(
  selectShoppinglistState,
  (state) => state.items
);

export const selectShoppingListSearchResult = createSelector(
  selectShoppinglistState,
  (state: IShoppingState): ISearchResult<IShoppingItem> | undefined =>
    filterBySearchQuery(state)
);

export const selectShoppingListItems = createSelector(
  selectShoppinglistState,
  selectShoppingListSearchResult,
  (state: IShoppingState, result): IShoppingItem[] | undefined =>
    filterAndSortItemList(state, result)
);
export const selectShoppingListCategories = createSelector(
  selectShoppinglistState,
  (state: IShoppingState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);
