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
import { matchingTxt } from '../../app.utils';

import { searchQueryByListId } from '../@shared/item-list.utils';
import { GlobalsActions } from '../globals/globals.actions';
import { ShoppingActions } from '../shopping/shopping.actions';
import { StorageActions } from '../storage/storage.actions';
import { TasksActions } from '../tasks/tasks.actions';
import { CategoriesActions, DialogsActions } from './dialogs.actions';
import {
  selectEditGlobalState,
  selectEditShoppingState,
  selectEditStorageState,
  selectEditTaskState,
} from './dialogs.selector';

@Injectable({ providedIn: 'root' })
export class DialogsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  showCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.showDialog),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const listItems: IBaseItem[] =
          state.dialogs.listId === '_tasks'
            ? state.tasks.items
            : ([] as IBaseItem[])
                .concat(state.globals.items)
                .concat(state.storage.items)
                .concat(state.shopping.items);
        return CategoriesActions.updateSelection(state.dialogs.item, listItems);
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

  //TODO: by listid with less effects... why one effect for each list...
  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.showCreateAndAddGlobalDialog),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const searchQuery = searchQueryByListId(state, action.listId);
        return DialogsActions.showEditDialog(
          createGlobalItem(matchingTxt(searchQuery ?? '')),
          '_globals',
          action.listId
        );
      })
    );
  });
  confirmGlobalItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      filter(([_, state]) => state.listId === '_globals'),
      map(([_, state]) => GlobalsActions.addOrUpdateItem(state.item))
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
        switch (<TItemListId>action.listId) {
          case '_storage':
            return DialogsActions.showEditDialog(
              createStorageItem(matchingTxt(state.storage.searchQuery ?? '')),
              '_storage'
            );
          case '_globals':
            return DialogsActions.showEditDialog(
              createGlobalItem(matchingTxt(state.globals.searchQuery ?? '')),
              '_globals'
            );
          case '_shopping':
            return DialogsActions.showEditDialog(
              createShoppingItem(matchingTxt(state.shopping.searchQuery ?? '')),
              '_shopping'
            );
          case '_tasks':
            return DialogsActions.showEditDialog(
              createTaskItem(matchingTxt(state.tasks.searchQuery ?? '')),
              '_tasks'
            );
        }
      })
    );
  });
  confirmStorageItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditStorageState)),
      filter(([_, state]) => state.listId === '_storage'),
      map(([_, state]) => StorageActions.addOrUpdateItem(state.item))
    );
  });
  confirmShoppingItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditShoppingState)),
      filter(([_, state]) => state.listId === '_shopping'),
      map(([_, state]) => ShoppingActions.addOrUpdateItem(state.item))
    );
  });
  confirmTaskItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditTaskState)),
      filter(([_, state]) => state.listId === '_tasks'),
      map(([_, state]) => TasksActions.addOrUpdateItem(state.item))
    );
  });
}
