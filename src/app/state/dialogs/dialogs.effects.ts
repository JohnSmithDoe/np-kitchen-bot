import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs';
import { IAppState, IBaseItem, TItemListId } from '../../@types/types';
import {
  createGlobalItem,
  createShoppingItem,
  createStorageItem,
  createTaskItem,
} from '../../app.factory';
import { actionsByListId } from '../@shared/item-list.effects';

import {
  filterByByListId,
  searchQueryByListId,
  stateByListId,
} from '../@shared/item-list.utils';
import { GlobalsActions } from '../globals/globals.actions';
import { ShoppingActions } from '../shopping/shopping.actions';
import { StorageActions } from '../storage/storage.actions';
import { CategoriesActions, DialogsActions } from './dialogs.actions';
import { selectEditGlobalState, selectEditState } from './dialogs.selector';

function createItemByListId(
  listId: TItemListId,
  name: string,
  category: string | undefined
) {
  let item: IBaseItem;
  switch (listId) {
    case '_storage':
      item = createStorageItem(name, category);
      break;
    case '_globals':
      item = createGlobalItem(name, category);
      break;
    case '_shopping':
      item = createShoppingItem(name, category);
      break;
    case '_tasks':
      item = createTaskItem(name, category);
      break;
  }
  return item;
}

@Injectable({ providedIn: 'root' })
export class DialogsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  showCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.showDialog),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const categories = stateByListId(
          state,
          state.dialogs.listId
        ).categories;
        return CategoriesActions.updateSelection(
          state.dialogs.item,
          categories
        );
      })
    );
  });

  confirmCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.confirmChanges),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const updateData: Partial<IBaseItem> = {
          category: state.dialogs.category.selection,
        };
        return DialogsActions.updateItem(updateData);
      })
    );
  });
  addCategoryFromDialogSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.addCategoryFromDialogSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const category = state.dialogs.category.searchQuery?.trim();
        return CategoriesActions.addCategory(category ?? '');
      })
    );
  });

  addCategoryToLlist$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.addCategory),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state, action }) => {
        return actionsByListId(state.dialogs.listId).addCategory(
          action.category
        );
      })
    );
  });

  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.showCreateAndAddGlobalDialog),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const searchQuery = searchQueryByListId(state, action.listId);
        const filterBy = filterByByListId(state, action.listId);
        return DialogsActions.showEditDialog(
          createGlobalItem(searchQuery ?? '', filterBy),
          '_globals',
          action.listId
        );
      })
    );
  });

  confirmItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditState)),
      map(([_, state]) => {
        const localActions = actionsByListId(state.listId);
        return localActions.addOrUpdateItem(<any>state.item);
      })
    );
  });

  confirmEditCategoryChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.confirmEditChanges),
      concatLatestFrom(() => this.#store.select(selectEditState)),
      map(([_, state]) => {
        const localActions = actionsByListId(state.listId);
        return localActions.updateCategory(
          state.category.original ?? '',
          state.category.editItem ?? ''
        );
      })
    );
  });

  confirmGlobalItemChangesAndAddToList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      filter(
        ([_, state]) =>
          state.listId === '_globals' && !!state.addToAdditionalList
      ),
      map(([_, state]) => {
        switch (state.addToAdditionalList!) {
          case '_storage':
            return StorageActions.addGlobalItem(state.item);
          case '_globals':
          case '_tasks':
            return GlobalsActions.addItemFailure(state.item);
          case '_shopping':
            return ShoppingActions.addGlobalItem(state.item);
        }
      })
    );
  });
  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const localState = stateByListId(state, action.listId);
        const name = localState.searchQuery ?? '';
        if (localState.mode === 'categories') {
          return CategoriesActions.showEditDialog(name, action.listId);
        } else {
          const category = localState.filterBy;
          const item = createItemByListId(action.listId, name, category);
          return DialogsActions.showEditDialog(item, action.listId);
        }
      })
    );
  });
}
