import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  ITaskItem,
  ITasksState,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.utils';

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
