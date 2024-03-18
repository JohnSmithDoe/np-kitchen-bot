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
  sortCategoriesFn,
} from '../@shared/item-list.utils';

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
    return [
      ...new Set(state.items.flatMap((item) => item.category ?? [])),
    ].sort(sortCategoriesFn(state.sort));
  }
);
export const selectShoppingListHasBoughtItems = createSelector(
  selectShoppingState,
  (state: IShoppingState): boolean =>
    !!state.items.find((item) => item.state === 'bought')
);
