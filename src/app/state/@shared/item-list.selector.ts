import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IShoppingItem,
  IShoppingState,
  TItemListCategory,
} from '../../@types/types';
import { selectShoppingState } from '../shopping/shopping.selector';

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

export const selectListCategories3 = createSelector(
  selectListState,
  (state) => {
    return state.categories;
  }
);
export const selectListCategories = createSelector(
  selectShoppingState,
  (state: IShoppingState): TItemListCategory[] | undefined => {
    return [
      ...new Set(state.items.flatMap((item) => item.category ?? [])),
    ].sort(sortCategoriesFn(state.sort));
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
