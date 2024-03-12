import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IStorageItem,
  IStorageState,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
  sortCategoriesFn,
} from '../@shared/item-list.selector';

export const selectStorageState =
  createFeatureSelector<IStorageState>('storage');

export const selectStorageListSearchResult = createSelector(
  selectStorageState,
  (state: IAppState) => state,
  (listState: IStorageState, state): ISearchResult<IStorageItem> | undefined =>
    filterBySearchQuery(state, listState)
);

export const selectStorageListItems = createSelector(
  selectStorageState,
  selectStorageListSearchResult,
  (state: IStorageState, result): IStorageItem[] | undefined =>
    filterAndSortItemList(state, result)
);

export const selectStorageListCategories = createSelector(
  selectStorageState,
  (state: IStorageState): TItemListCategory[] | undefined => {
    return [
      ...new Set(state.items.flatMap((item) => item.category ?? [])),
    ].sort(sortCategoriesFn(state.sort));
  }
);
