import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IShoppingItem,
  TItemListCategory,
} from '../../@types/types';

import {
  filterAndSortItemList,
  filterBySearchQuery,
  sortCategoriesFn,
  stateByListId,
} from './item-list.utils';

const selectRouterState = createFeatureSelector<RouterReducerState>('router');
const { selectRouteParams } = getRouterSelectors(selectRouterState);

export const selectListState = createSelector(
  selectRouteParams,
  (state: IAppState) => state,
  ({ listId }, state) => {
    return stateByListId(state, listId);
  }
);

export const selectListCategories = createSelector(
  selectListState,
  (state): TItemListCategory[] => {
    return state.categories?.sort(sortCategoriesFn(state.sort)) ?? [];
  }
);

export const selectListSearchResult = createSelector(
  selectListState,
  (state: IAppState) => state,
  (state, appState): ISearchResult<IShoppingItem> | undefined => {
    return filterBySearchQuery(appState, state);
  }
);

export const selectListItems = createSelector(
  selectListState,
  selectListSearchResult,
  (state, result): IShoppingItem[] | undefined =>
    filterAndSortItemList(state, result)
);
