import { createReducer, on } from '@ngrx/store';
import { ICategoriesState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { CategoriesActions } from './categories.actions';

export const initialSettings: ICategoriesState = {
  categories: [],
  selection: [],
};
export const categoriesReducer = createReducer(
  initialSettings,
  on(CategoriesActions.addCategory, (state) => {
    const category = state.searchQuery?.trim();
    if (category && !state.categories.includes(category)) {
      return {
        ...state,
        categories: [category, ...state.categories],
        selection: [category, ...state.selection],
        searchQuery: undefined,
      };
    }
    return state;
  }),

  on(CategoriesActions.removeCategory, (state, { category }) => {
    const categoryIdx = state.selection.indexOf(category);
    if (categoryIdx >= 0) {
      const selection = [...state.selection].splice(categoryIdx, 1);
      return { ...state, selection };
    }
    return state;
  }),

  on(CategoriesActions.showDialog, (state, { item, items }) => {
    const categories = [
      ...new Set((items ?? []).flatMap((item) => item.category ?? [])),
    ];
    return {
      ...state,
      categories,
      selection: item?.category ?? [],
      isSelecting: true,
    };
  }),
  on(CategoriesActions.confirmChanges, (state) => {
    return { ...state, isSelecting: false };
  }),
  on(CategoriesActions.abortChanges, (state) => {
    return { ...state, isSelecting: false };
  }),

  on(CategoriesActions.toggleCategory, (state, { category }) => {
    if (state.selection.includes(category)) {
      const selection = state.selection.filter((item) => item !== category);
      return { ...state, selection };
    } else {
      return { ...state, selection: [category, ...state.selection] };
    }
  }),

  on(CategoriesActions.updateSearchQuery, (state, { query }) => {
    return { ...state, searchQuery: query };
  }),

  on(ApplicationActions.loadedSuccessfully, (_state, { datastore }) => {
    console.log('Load Categories.... hmmm probably not', datastore);
    return _state;
  })
);
