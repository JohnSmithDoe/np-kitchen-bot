import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  IShoppingItem,
  TItemListCategory,
} from '../../@types/types';
import { matchesCategoryExactly, matchesSearch } from '../../app.utils';

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
  (state): { category: TItemListCategory; count: number }[] => {
    return [...state.categories]
      .sort(sortCategoriesFn(state.sort))
      .filter((cat) => matchesSearch(cat, state.searchQuery ?? ''))
      .map((catgory) => ({
        category: catgory,
        count: state.items.reduce((count, cur) => {
          return matchesCategoryExactly(cur, catgory) ? count + 1 : count;
        }, 0),
      }));
  }
);

export const selectListStateFilter = createSelector(
  selectListState,
  (
    state
  ): {
    isCategoryModeOrHasFilter: boolean;
    hasFilter: boolean;
  } => {
    return {
      isCategoryModeOrHasFilter:
        !!state.filterBy || state.mode === 'categories',
      hasFilter: !!state.filterBy,
    };
  }
);

export const selectListSearchResult = createSelector(
  selectListState,
  (state: IAppState) => state,
  (state, appState): ISearchResult<IShoppingItem> | undefined => {
    return state.mode !== 'categories'
      ? filterBySearchQuery(appState, state)
      : undefined;
  }
);

export const selectListItems = createSelector(
  selectListState,
  selectListSearchResult,
  (state, result): IShoppingItem[] | undefined =>
    filterAndSortItemList(state, result)
);
