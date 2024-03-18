import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IShoppingItem,
  IShoppingState,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
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

export const selectShoppingListHasBoughtItems = createSelector(
  selectShoppingState,
  (state: IShoppingState): boolean =>
    !!state.items.find((item) => item.state === 'bought')
);
