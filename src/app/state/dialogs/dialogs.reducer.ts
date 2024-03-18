import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { createReducer, on } from '@ngrx/store';
import {
  IBaseItem,
  IEditItemState,
  TDialogsState,
  TEditItemMode,
  TItemListId,
} from '../../@types/types';
import { createStorageItem } from '../../app.factory';
import { ApplicationActions } from '../application.actions';
import { CategoriesActions, DialogsActions } from './dialogs.actions';

export const initialSettings: TDialogsState = {
  isEditing: false,
  item: createStorageItem('initial'),
  listId: '_storage',
  category: {
    categories: [],
    selection: [],
  },
  addToAdditionalList: undefined,
};

export const dialogsReducer = createReducer(
  initialSettings,
  on(
    DialogsActions.showEditDialog,
    (state, { item, listId, additional }): TDialogsState => {
      return showEditDialog(
        state,
        { ...item },
        item ? 'update' : 'create',
        listId,
        additional
      );
    }
  ),
  on(DialogsActions.updateItem, (state, { data }): TDialogsState => {
    return { ...state, item: { ...state.item, ...data } };
  }),
  on(DialogsActions.removeCategory, (state, { category }): TDialogsState => {
    return {
      ...state,
      item: {
        ...state.item,
        category: state.item.category?.filter((cat) => cat !== category),
      },
    };
  }),
  on(DialogsActions.hideDialog, (state): TDialogsState => {
    return { ...state, isEditing: false };
  }),
  on(DialogsActions.confirmChanges, (state): TDialogsState => {
    return { ...state, isEditing: false };
  }),
  on(DialogsActions.abortChanges, (state): TDialogsState => {
    return { ...state, isEditing: false };
  }),

  on(CategoriesActions.addCategory, (state): TDialogsState => {
    const category = state.category.searchQuery?.trim();
    if (category && !state.category.categories.includes(category)) {
      return {
        ...state,
        category: {
          ...state.category,
          categories: [category, ...state.category.categories],
          selection: [category, ...state.category.selection],
          searchQuery: undefined,
        },
      };
    }
    return state;
  }),

  on(CategoriesActions.removeCategory, (state, { category }): TDialogsState => {
    const categoryIdx = state.category.selection.indexOf(category);
    if (categoryIdx >= 0) {
      const selection = [...state.category.selection].splice(categoryIdx, 1);
      return {
        ...state,
        category: {
          ...state.category,
          selection,
        },
      };
    }
    return state;
  }),

  on(
    CategoriesActions.updateSelection,
    (state, { item, items }): TDialogsState => {
      const categories = [
        ...new Set(
          [...(items ?? []), item]
            .flatMap((aitem) => aitem?.category ?? [])
            .filter((cat) => !!cat.length)
        ),
      ];
      return {
        ...state,
        category: {
          ...state.category,
          categories,
          selection: item?.category ?? [],
          isSelecting: true,
        },
      };
    }
  ),
  on(CategoriesActions.showDialog, (state): TDialogsState => {
    return {
      ...state,
      category: {
        ...state.category,
        isSelecting: true,
      },
    };
  }),
  on(CategoriesActions.confirmChanges, (state): TDialogsState => {
    return {
      ...state,
      category: {
        ...state.category,
        isSelecting: false,
      },
    };
  }),
  on(CategoriesActions.abortChanges, (state): TDialogsState => {
    return {
      ...state,
      category: {
        ...state.category,
        isSelecting: false,
      },
    };
  }),

  on(CategoriesActions.toggleCategory, (state, { category }): TDialogsState => {
    if (state.category.selection.includes(category)) {
      const selection = state.category.selection.filter(
        (item) => item !== category
      );
      return {
        ...state,
        category: {
          ...state.category,
          selection,
        },
      };
    } else {
      return {
        ...state,
        category: {
          ...state.category,
          selection: [category, ...state.category.selection],
        },
      };
    }
  }),

  on(CategoriesActions.updateSearchQuery, (state, { query }): TDialogsState => {
    return {
      ...state,
      category: {
        ...state.category,
        searchQuery: query,
      },
    };
  }),

  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): TDialogsState => {
      return _state;
    }
  )
);

const showEditDialog = <R extends IBaseItem>(
  state: IEditItemState<R>,
  item: R,
  editMode: TEditItemMode,
  listId: TItemListId,
  additional?: TItemListId
): IEditItemState<R> => {
  const saveButtonText = item
    ? marker('edit.item.dialog.button.update')
    : marker('edit.item.dialog.button.create');

  const dialogTitle = item
    ? marker('edit.item.dialog.title.update')
    : marker('edit.item.dialog.title.create');

  return {
    ...state,
    isEditing: true,
    item,
    editMode,
    saveButtonText,
    dialogTitle,
    listId,
    addToAdditionalList: additional,
  };
};
