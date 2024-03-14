import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { TItemListId } from '../@types/types';
import { createGlobalItem, createShoppingItem } from '../app.factory';
import { DatabaseService } from '../services/database.service';
import { createQuickAddState } from './@shared/item-list.effects';
import { ApplicationActions } from './application.actions';
import { DialogsActions } from './dialogs/dialogs.actions';
import {
  selectEditGlobalState,
  selectEditShoppingState,
  selectEditStorageState,
} from './dialogs/dialogs.selector';
import { GlobalsActions } from './globals/globals.actions';
import { QuickAddActions } from './quick-add/quick-add.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';

@Injectable({ providedIn: 'root' })
export class ApplicationEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ApplicationActions.load),
      combineLatestWith(fromPromise(this.#database.create())),
      map(([_, data]) => ApplicationActions.loadedSuccessfully(data))
    );
  });

  updateQuickAdd$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        ShoppingActions.updateSearch,
        ShoppingActions.enterPage,
        StorageActions.updateSearch,
        StorageActions.enterPage,
        GlobalsActions.updateSearch,
        GlobalsActions.enterPage
      ),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }) => {
        let listId: TItemListId;
        switch (action.type) {
          case '[Globals] Update Search':
          case '[Globals] Enter Page':
            listId = '_globals';
            break;
          case '[Shopping] Update Search':
          case '[Shopping] Enter Page':
            listId = '_shopping';
            break;
          case '[Storage] Update Search':
          case '[Storage] Enter Page':
            listId = '_storage';
            break;
        }
        const newState = createQuickAddState(state, listId);
        return QuickAddActions.updateState(newState);
      })
    );
  });

  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.showCreateGlobalDialogWithSearch,
        ShoppingActions.showCreateGlobalDialogWithSearch
      ),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }) => {
        const item = createGlobalItem(state.storage.searchQuery ?? '');
        switch (action.type) {
          case '[Shopping] Show Create Global Dialog With Search':
            return DialogsActions.showDialog(item, '_shopping');
          case '[Storage] Show Create Global Dialog With Search':
            return DialogsActions.showDialog(item, '_storage');
        }
      })
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        ShoppingActions.showCreateDialogWithSearch,
        StorageActions.showCreateDialogWithSearch,
        GlobalsActions.showCreateDialogWithSearch
      ),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }) => {
        const item = createShoppingItem(state.shopping.searchQuery ?? '');
        switch (action.type) {
          case '[Shopping] Show Create Dialog With Search':
            return DialogsActions.showDialog(item, '_shopping');
          case '[Storage] Show Create Dialog With Search':
            return DialogsActions.showDialog(item, '_storage');
          case '[Globals] Show Create Dialog With Search':
            return DialogsActions.showDialog(item, '_globals');
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
  confirmGlobalItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      filter(([_, state]) => state.listId === '_globals'),
      map(([_, state]) => GlobalsActions.addOrUpdateItem(state.item))
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
}
