import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICategoriesState, IEditItemState } from '../../@types/types';
import { matchesSearchString } from '../../app.utils';

export const selectEditState =
  createFeatureSelector<IEditItemState<any>>('dialogs');

export const selectCategoriesState = createSelector(
  selectEditState,
  (state): ICategoriesState => state.category
);

export const selectAllCategories = createSelector(
  selectEditState,
  (state) => state.category.categories
);

export const selectSelectedCategories = createSelector(
  selectEditState,
  (state) => state.category.selection
);
export const selectCategories = createSelector(
  selectEditState,
  selectAllCategories,
  (state, allCategories) => {
    return !state.category.searchQuery || !state.category.searchQuery.length
      ? allCategories
      : allCategories.filter((cat) =>
          matchesSearchString(cat, state.category.searchQuery)
        );
  }
);

export const selectContainsSearchResult = createSelector(
  selectEditState,
  selectCategories,
  (state, current) =>
    state.category.searchQuery &&
    state.category.searchQuery.length &&
    current.includes(state.category.searchQuery)
);
