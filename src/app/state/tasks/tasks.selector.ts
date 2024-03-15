import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  ITaskItem,
  ITasksState,
  TItemListCategory,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
  sortCategoriesFn,
} from '../@shared/item-list.selector';

export const selectTasksState = createFeatureSelector<ITasksState>('tasks');

export const selectTasksListSearchResult = createSelector(
  selectTasksState,
  (state: IAppState) => state,
  (listState, state): ISearchResult<ITaskItem> | undefined =>
    filterBySearchQuery(state, listState)
);

export const selectTasksListItems = createSelector(
  selectTasksState,
  selectTasksListSearchResult,
  (state: ITasksState, result): ITaskItem[] | undefined =>
    filterAndSortItemList(state, result)
);

export const selectTasksListCategories = createSelector(
  selectTasksState,
  (state: ITasksState): TItemListCategory[] | undefined => {
    return [
      ...new Set(state.items.flatMap((item) => item.category ?? [])),
    ].sort(sortCategoriesFn(state.sort));
  }
);
