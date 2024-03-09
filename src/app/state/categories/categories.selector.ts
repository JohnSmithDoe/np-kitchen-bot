import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICategoriesState } from '../../@types/types';

export const selectCategoriesState =
  createFeatureSelector<ICategoriesState>('categories');

export const selectAllCategories = createSelector(
  selectCategoriesState,
  (state) => state.categories
);

export const selectSelectedCategories = createSelector(
  selectCategoriesState,
  (state) => state.selection
);
export const selectCategories = createSelector(
  selectCategoriesState,
  selectAllCategories,
  (state, allCategories) => {
    return !state.searchQuery || !state.searchQuery.length
      ? allCategories
      : allCategories.filter((cat) =>
          cat.toLowerCase().includes(state.searchQuery?.toLowerCase() ?? '')
        );
  }
);

export const selectContainsSearchResult = createSelector(
  selectCategoriesState,
  selectCategories,
  (state, current) => {
    console.log(state, current);
    return (
      state.searchQuery &&
      state.searchQuery.length &&
      current.includes(state.searchQuery)
    );
  }
);
