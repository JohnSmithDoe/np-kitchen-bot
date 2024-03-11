import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IGlobalItem,
  IGlobalsState,
  ISearchResult,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';

export const selectGlobalsState =
  createFeatureSelector<IGlobalsState>('globals');

export const selectGlobalsList = createSelector(
  selectGlobalsState,
  (state) => state.items
);

export const selectGlobalsListSearchResult = createSelector(
  selectGlobalsState,
  (state: IGlobalsState): ISearchResult<IGlobalItem> | undefined =>
    filterBySearchQuery(state)
);

export const selectGlobalsListItems = createSelector(
  selectGlobalsState,
  selectGlobalsListSearchResult,
  (state: IGlobalsState, result): IGlobalItem[] | undefined =>
    filterAndSortItemList(state, result)
);
export const selectGlobalsListCategories = createSelector(
  selectGlobalsState,
  (state: IGlobalsState): TItemListCategory[] | undefined => {
    return [...new Set(state.items.flatMap((item) => item.category ?? []))];
  }
);
