import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
  createTaskItem,
} from '../app.factory';
import { matchesItemExactly } from '../app.utils';
import { DatabaseService } from '../services/database.service';

import { updateQuickAddState } from './@shared/item-list.utils';
import { ApplicationActions } from './application.actions';
import { GlobalsActions } from './globals/globals.actions';
import { QuickAddActions } from './quick-add/quick-add.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';
import { TasksActions } from './tasks/tasks.actions';

function updatedSearchQuery(item: IBaseItem, searchQuery: string | undefined) {
  if (!!item.name && !item.name.includes(searchQuery ?? '')) {
    searchQuery = undefined;
  }
  return searchQuery;
}

function addStorageItemFromSearch(state: IAppState) {
  const storageItem = createStorageItem(state.storage.searchQuery ?? '');
  const foundStorageItem = matchesItemExactly(storageItem, state.storage.items);
  return foundStorageItem
    ? StorageActions.addItemFailure(foundStorageItem)
    : StorageActions.addItem(storageItem);
}

function addShoppingItemFromSearch(state: IAppState) {
  const shoppingItem = createShoppingItem(state.shopping.searchQuery ?? '');
  const foundShoppingItem = matchesItemExactly(
    shoppingItem,
    state.shopping.items
  );
  return foundShoppingItem
    ? ShoppingActions.addItemFailure(foundShoppingItem)
    : ShoppingActions.addItem(shoppingItem);
}

function addGlobalItemFromSearch(state: IAppState) {
  const item = createGlobalItem(state.globals.searchQuery ?? '');
  const found = matchesItemExactly(item, state.globals.items);
  return found
    ? GlobalsActions.addItemFailure(found)
    : GlobalsActions.addItem(item);
}
function addTaskItemFromSearch(state: IAppState) {
  const item = createTaskItem(state.tasks.searchQuery ?? '');
  const found = matchesItemExactly(item, state.tasks.items);
  return found
    ? TasksActions.addItemFailure(found)
    : TasksActions.addItem(item);
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
        GlobalsActions.addItemFromSearch,
        TasksActions.addItemFromSearch
      ),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Storage] Add Item From Search':
            return addStorageItemFromSearch(state);
          case '[Shopping] Add Item From Search':
            return addShoppingItemFromSearch(state);
          case '[Globals] Add Item From Search':
            return addGlobalItemFromSearch(state);
          case '[Tasks] Add Item From Search':
            return addTaskItemFromSearch(state);
        }
      })
    );
  });
  addOrUpdateItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addOrUpdateItem,
        ShoppingActions.addOrUpdateItem,
        GlobalsActions.addOrUpdateItem,
        TasksActions.addOrUpdateItem
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
          case '[Tasks] Add Or Update Item':
            return matchesItemExactly(action.item, state.tasks.items)
              ? TasksActions.updateItem(action.item)
              : TasksActions.addItem(action.item);
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
        ShoppingActions.updateMode,
        TasksActions.updateMode
      ),
      filter(({ mode }) => mode !== 'categories'),
      map(({ mode, type }) => {
        switch (type) {
          case '[Storage] Update Mode':
            return StorageActions.updateFilter();
          case '[Tasks] Update Mode':
            return TasksActions.updateFilter();
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
        StorageActions.updateFilter,
        StorageActions.updateMode,
        GlobalsActions.addItem,
        GlobalsActions.updateFilter,
        GlobalsActions.updateMode,
        ShoppingActions.addItem,
        ShoppingActions.updateFilter,
        ShoppingActions.updateMode,
        TasksActions.addItem,
        TasksActions.updateFilter,
        TasksActions.updateMode
      ),
      map(({ type }) => {
        switch (type) {
          case '[Storage] Add Item':
          case '[Storage] Update Filter':
          case '[Storage] Update Mode':
            return StorageActions.updateSearch('');
          case '[Globals] Add Item':
          case '[Globals] Update Filter':
          case '[Globals] Update Mode':
            return GlobalsActions.updateSearch('');
          case '[Shopping] Add Item':
          case '[Shopping] Update Filter':
          case '[Shopping] Update Mode':
            return ShoppingActions.updateSearch('');
          case '[Tasks] Add Item':
          case '[Tasks] Update Filter':
          case '[Tasks] Update Mode':
            return TasksActions.updateSearch('');
        }
      })
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.updateItem,
        ShoppingActions.updateItem,
        GlobalsActions.updateItem,
        TasksActions.updateItem
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
          case '[Tasks] Update Item':
            return TasksActions.updateSearch(
              updatedSearchQuery(action.item, state.tasks.searchQuery)
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
        ShoppingActions.updateMode,
        StorageActions.updateSearch,
        StorageActions.updateMode,
        StorageActions.enterPage,
        GlobalsActions.updateSearch,
        GlobalsActions.updateMode,
        GlobalsActions.enterPage,
        TasksActions.updateSearch,
        TasksActions.updateMode,
        TasksActions.enterPage
      ),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }) => {
        let listId: TItemListId;
        switch (action.type) {
          case '[Globals] Update Search':
          case '[Globals] Update Mode':
          case '[Globals] Enter Page':
            listId = '_globals';
            break;
          case '[Shopping] Update Search':
          case '[Shopping] Update Mode':
          case '[Shopping] Enter Page':
            listId = '_shopping';
            break;
          case '[Storage] Update Search':
          case '[Storage] Update Mode':
          case '[Storage] Enter Page':
            listId = '_storage';
            break;
          case '[Tasks] Update Search':
          case '[Tasks] Update Mode':
          case '[Tasks] Enter Page':
            listId = '_tasks';
            break;
        }
        const newState = updateQuickAddState(state, listId);
        return QuickAddActions.updateState(newState);
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          ShoppingActions.addItem,
          ShoppingActions.addCategory,
          ShoppingActions.removeItem,
          ShoppingActions.removeCategory,
          ShoppingActions.updateItem,
          ShoppingActions.removeItems,

          StorageActions.addItem,
          StorageActions.addCategory,
          StorageActions.removeItem,
          StorageActions.removeCategory,
          StorageActions.updateItem,
          StorageActions.addShoppingList,

          GlobalsActions.addItem,
          GlobalsActions.addCategory,
          GlobalsActions.removeItem,
          GlobalsActions.removeCategory,
          GlobalsActions.updateItem,

          TasksActions.addItem,
          TasksActions.addCategory,
          TasksActions.removeItem,
          TasksActions.removeCategory,
          TasksActions.updateItem
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
          } else if (action.type.startsWith('[Tasks]')) {
            return fromPromise(this.#database.save('tasks', state.tasks));
          } else {
            throw Error('should not happen');
          }
        })
      );
    },
    { dispatch: false }
  );
}
