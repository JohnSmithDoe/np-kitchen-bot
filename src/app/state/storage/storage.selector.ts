import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IStorageItem,
  IStorageState,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.utils';

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
