import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICategoriesState } from '../../@types/types';
import { matchesSearchString } from '../../app.utils';

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
          matchesSearchString(cat, state.searchQuery)
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
