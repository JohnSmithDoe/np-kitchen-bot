import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ICategoriesState,
  IEditGlobalItemState,
  IEditItemState,
  IEditShoppingItemState,
  IEditStorageItemState,
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
} from '../../@types/types';
import { matchesSearchString } from '../../app.utils';

export const selectEditGlobalState =
  createFeatureSelector<IEditGlobalItemState>('dialogs');

export const selectEditShoppingState =
  createFeatureSelector<IEditShoppingItemState>('dialogs');

export const selectEditState =
  createFeatureSelector<IEditItemState<any>>('dialogs');

export const selectEditStorageState =
  createFeatureSelector<IEditStorageItemState>('dialogs');

export const selectEditStorageItem = createSelector(
  selectEditStorageState,
  (state): IStorageItem | undefined => state.item
);

export const selectEditGlobalItem = createSelector(
  selectEditGlobalState,
  (state): IGlobalItem | undefined => state.item
);

export const selectEditShoppingItem = createSelector(
  selectEditShoppingState,
  (state): IShoppingItem | undefined => state.item
);

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
