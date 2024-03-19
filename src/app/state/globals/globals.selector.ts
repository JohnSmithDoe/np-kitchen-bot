import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  IGlobalItem,
  IGlobalsState,
  ISearchResult,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';

export const selectGlobalsState =
  createFeatureSelector<IGlobalsState>('globals');

export const selectGlobalsListSearchResult = createSelector(
  selectGlobalsState,
  (state: IAppState) => state,
  (listState, state): ISearchResult<IGlobalItem> | undefined =>
    filterBySearchQuery(state, listState)
);

export const selectGlobalListItems = createSelector(
  selectGlobalsState,
  selectGlobalsListSearchResult,
  (state: IGlobalsState, result): IGlobalItem[] | undefined =>
    filterAndSortItemList(state, result)
);
