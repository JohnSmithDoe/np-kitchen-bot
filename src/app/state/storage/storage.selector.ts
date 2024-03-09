import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ISearchResult,
  IStorageItem,
  IStorageState,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../shared/item-list.selector';

export const selectStorageState =
  createFeatureSelector<IStorageState>('storage');

export const selectStorageList = createSelector(
  selectStorageState,
  (state) => state.items
);

export const selectStorageListSearchResult = createSelector(
  selectStorageState,
  (state: IStorageState): ISearchResult<IStorageItem> | undefined =>
    filterBySearchQuery(state)
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
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);
