import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IBaseItem, TItemListId } from '../@types/types';
import {
  createGlobalItem,
  createGlobalItemFrom,
  createShoppingItem,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
  createStorageItem,
  createStorageItemFromGlobal,
  createStorageItemFromShopping,
} from '../app.factory';
import { matchesItemExactly, matchingTxt } from '../app.utils';
import { DatabaseService } from '../services/database.service';
import { updateQuickAddState } from './@shared/item-list.effects';
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

function updatedSearchQuery(item: IBaseItem, searchQuery: string | undefined) {
  if (!!item.name && !item.name.includes(searchQuery ?? '')) {
    searchQuery = undefined;
  }
  return searchQuery;
}

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

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addItemFromSearch,
        ShoppingActions.addItemFromSearch,
        GlobalsActions.addItemFromSearch
      ),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Storage] Add Item From Search':
            const storageItem = createStorageItem(
              state.storage.searchQuery ?? ''
            );
            const foundStorageItem = matchesItemExactly(
              storageItem,
              state.storage.items
            );
            return foundStorageItem
              ? StorageActions.addItemFailure(foundStorageItem)
              : StorageActions.addItem(storageItem);

          case '[Shopping] Add Item From Search':
            const shoppingItem = createShoppingItem(
              state.shopping.searchQuery ?? ''
            );
            const foundShoppingItem = matchesItemExactly(
              shoppingItem,
              state.shopping.items
            );
            return foundShoppingItem
              ? ShoppingActions.addItemFailure(foundShoppingItem)
              : ShoppingActions.addItem(shoppingItem);
          case '[Globals] Add Item From Search':
            const item = createGlobalItem(state.globals.searchQuery ?? '');
            const found = matchesItemExactly(item, state.globals.items);
            return found
              ? GlobalsActions.addItemFailure(found)
              : GlobalsActions.addItem(item);
        }
      })
    );
  });
  addOrUpdateItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addOrUpdateItem,
        ShoppingActions.addOrUpdateItem,
        GlobalsActions.addOrUpdateItem
      ),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Storage] Add Or Update Item':
            return matchesItemExactly(action.item, state.storage.items)
              ? StorageActions.updateItem(action.item)
              : StorageActions.addItem(action.item);
          case '[Globals] Add Or Update Item':
            return matchesItemExactly(action.item, state.globals.items)
              ? GlobalsActions.updateItem(action.item)
              : GlobalsActions.addItem(action.item);
          case '[Shopping] Add Or Update Item':
            return matchesItemExactly(action.item, state.shopping.items)
              ? ShoppingActions.updateItem(action.item)
              : ShoppingActions.addItem(action.item);
        }
      })
    );
  });
  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addGlobalItem, ShoppingActions.addGlobalItem),
      map(({ item, type }) => {
        switch (type) {
          case '[Storage] Add Global Item':
            const storageitem = createStorageItemFromGlobal(item);
            return StorageActions.addOrUpdateItem(storageitem);
          case '[Shopping] Add Global Item':
            const shoppingitem = createShoppingItemFromGlobal(item);
            return ShoppingActions.addOrUpdateItem(shoppingitem);
        }
      })
    );
  });
  addItemFromShopping$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addShoppingItem, GlobalsActions.addShoppingItem),
      map(({ item, type }) => {
        switch (type) {
          case '[Storage] Add Shopping Item':
            const storageitem = createStorageItemFromShopping(item);
            return StorageActions.addOrUpdateItem(storageitem);
          case '[Globals] Add Shopping Item':
            const globalItem = createGlobalItemFrom(item);
            return GlobalsActions.addOrUpdateItem(globalItem);
        }
      })
    );
  });
  addItemFromStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addStorageItem, GlobalsActions.addStorageItem),
      map(({ item, type }) => {
        switch (type) {
          case '[Shopping] Add Storage Item':
            const shoppingItem = createShoppingItemFromStorage(item);
            return ShoppingActions.addOrUpdateItem(shoppingItem);
          case '[Globals] Add Storage Item':
            const globalItem = createGlobalItemFrom(item);
            return GlobalsActions.addOrUpdateItem(globalItem);
        }
      })
    );
  });

  clearFilter$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.updateMode,
        GlobalsActions.updateMode,
        ShoppingActions.updateMode
      ),
      filter(({ mode }) => mode !== 'categories'),
      map(({ mode, type }) => {
        switch (type) {
          case '[Storage] Update Mode':
            return StorageActions.updateFilter();
          case '[Globals] Update Mode':
            return GlobalsActions.updateFilter();
          case '[Shopping] Update Mode':
            return ShoppingActions.updateFilter();
        }
      })
    );
  });
  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addItem,
        GlobalsActions.addItem,
        ShoppingActions.addItem
      ),
      map(({ type }) => {
        switch (type) {
          case '[Storage] Add Item':
            return StorageActions.updateSearch('');
          case '[Globals] Add Item':
            return GlobalsActions.updateSearch('');
          case '[Shopping] Add Item':
            return ShoppingActions.updateSearch('');
        }
      })
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.updateItem,
        ShoppingActions.updateItem,
        GlobalsActions.updateItem
      ),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Storage] Update Item':
            return StorageActions.updateSearch(
              updatedSearchQuery(action.item, state.storage.searchQuery)
            );
          case '[Shopping] Update Item':
            return ShoppingActions.updateSearch(
              updatedSearchQuery(action.item, state.shopping.searchQuery)
            );
          case '[Globals] Update Item':
            return GlobalsActions.updateSearch(
              updatedSearchQuery(action.item, state.globals.searchQuery)
            );
        }
      })
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
        const newState = updateQuickAddState(state, listId);
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
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Shopping] Show Create Global Dialog With Search':
            return DialogsActions.showDialog(
              createGlobalItem(matchingTxt(state.shopping.searchQuery ?? '')),
              '_globals',
              '_shopping'
            );
          case '[Storage] Show Create Global Dialog With Search':
            return DialogsActions.showDialog(
              createGlobalItem(matchingTxt(state.storage.searchQuery ?? '')),
              '_globals',
              '_storage'
            );
        }
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
            return GlobalsActions.addItemFailure(state.item);
          case '_shopping':
            return ShoppingActions.addGlobalItem(state.item);
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
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Shopping] Show Create Dialog With Search':
            return DialogsActions.showDialog(
              createShoppingItem(matchingTxt(state.shopping.searchQuery ?? '')),
              '_shopping'
            );
          case '[Storage] Show Create Dialog With Search':
            return DialogsActions.showDialog(
              createStorageItem(matchingTxt(state.storage.searchQuery ?? '')),
              '_storage'
            );
          case '[Globals] Show Create Dialog With Search':
            return DialogsActions.showDialog(
              createGlobalItem(matchingTxt(state.globals.searchQuery ?? '')),
              '_globals'
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

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          ShoppingActions.addItem,
          ShoppingActions.removeItem,
          ShoppingActions.updateItem,
          StorageActions.addItem,
          StorageActions.removeItem,
          StorageActions.updateItem,
          GlobalsActions.addItem,
          GlobalsActions.removeItem,
          GlobalsActions.updateItem
        ),
        withLatestFrom(this.#store, (action, state: IAppState) => ({
          action,
          state,
        })),
        map(({ action, state }) => {
          if (action.type.startsWith('[Storage]')) {
            return fromPromise(this.#database.save('storage', state.storage));
          } else if (action.type.startsWith('[Shopping]')) {
            return fromPromise(this.#database.save('shopping', state.shopping));
          } else if (action.type.startsWith('[Globals]')) {
            return fromPromise(this.#database.save('globals', state.globals));
          } else {
            throw Error('should not happen');
          }
        })
      );
    },
    { dispatch: false }
  );
}
