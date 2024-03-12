import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IShoppingItem,
  IShoppingState,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';

export const selectShoppingState =
  createFeatureSelector<IShoppingState>('shopping');

export const selectShoppingSearchResult = createSelector(
  selectShoppingState,
  (state: IAppState) => state,
  (
    listState: IShoppingState,
    state
  ): ISearchResult<IShoppingItem> | undefined =>
    filterBySearchQuery(state, listState)
);

export const selectShoppingItems = createSelector(
  selectShoppingState,
  selectShoppingSearchResult,
  (state: IShoppingState, result): IShoppingItem[] | undefined =>
    filterAndSortItemList(state, result)
);
export const selectShoppingCategories = createSelector(
  selectShoppingState,
  (state: IShoppingState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);
