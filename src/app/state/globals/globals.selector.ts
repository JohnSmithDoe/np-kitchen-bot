import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  IGlobalItem,
  IGlobalsState,
  ISearchResult,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
  sortCategoriesFn,
} from '../@shared/item-list.selector';

export const selectGlobalsState =
  createFeatureSelector<IGlobalsState>('globals');

export const selectGlobalsListSearchResult = createSelector(
  selectGlobalsState,
  (state: IAppState) => state,
  (listState, state): ISearchResult<IGlobalItem> | undefined =>
    filterBySearchQuery(state, listState)
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
    return [
      ...new Set(state.items.flatMap((item) => item.category ?? [])),
    ].sort(sortCategoriesFn(state.sort));
  }
);
