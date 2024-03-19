import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../@types/types';
import {
  createGlobalItemFrom,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
  createStorageItemFromGlobal,
  createStorageItemFromShopping,
} from '../app.factory';
import { matchesItemExactly } from '../app.utils';
import { DatabaseService } from '../services/database.service';
import {
  actionsByListId,
  addGlobalItemFromSearch,
  addShoppingItemFromSearch,
  addStorageItemFromSearch,
  addTaskItemFromSearch,
} from './@shared/item-list.effects';

import {
  listIdByPrefix,
  searchQueryByListId,
  stateByListId,
  updatedSearchQuery,
  updateQuickAddState,
} from './@shared/item-list.utils';
import { ApplicationActions } from './application.actions';
import { GlobalsActions } from './globals/globals.actions';
import { QuickAddActions } from './quick-add/quick-add.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';
import { TasksActions } from './tasks/tasks.actions';

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
        const listId = listIdByPrefix(action.type);
        const localState = stateByListId(state, listId);
        const actions = actionsByListId(listId);
        return matchesItemExactly(action.item, localState.items)
          ? actions.updateItem(action.item)
          : actions.addItem(<any>action.item);
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
        const listId = listIdByPrefix(type);
        return actionsByListId(listId).updateFilter();
      })
    );
  });
  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addItem,
        StorageActions.updateFilter,
        StorageActions.updateMode,
        StorageActions.addCategory,
        StorageActions.removeCategory,
        GlobalsActions.addItem,
        GlobalsActions.updateFilter,
        GlobalsActions.updateMode,
        GlobalsActions.addCategory,
        GlobalsActions.removeCategory,
        ShoppingActions.addItem,
        ShoppingActions.updateFilter,
        ShoppingActions.updateMode,
        ShoppingActions.addCategory,
        ShoppingActions.removeCategory,
        TasksActions.addItem,
        TasksActions.updateFilter,
        TasksActions.updateMode,
        TasksActions.addCategory,
        TasksActions.removeCategory
      ),
      map(({ type }) => {
        const listId = listIdByPrefix(type);
        return actionsByListId(listId).updateSearch('');
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
        const listId = listIdByPrefix(action.type);
        const searchQuery = searchQueryByListId(state, listId);
        return actionsByListId(listId).updateSearch(
          updatedSearchQuery(action.item, searchQuery)
        );
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
        const listId = listIdByPrefix(action.type);
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
          ShoppingActions.removeItem,
          ShoppingActions.updateItem,
          ShoppingActions.removeItems,
          ShoppingActions.addCategory,
          ShoppingActions.removeCategory,

          StorageActions.addItem,
          StorageActions.removeItem,
          StorageActions.updateItem,
          StorageActions.addShoppingList,
          StorageActions.addCategory,
          StorageActions.removeCategory,

          GlobalsActions.addItem,
          GlobalsActions.removeItem,
          GlobalsActions.updateItem,
          GlobalsActions.addCategory,
          GlobalsActions.removeCategory,

          TasksActions.addItem,
          TasksActions.removeItem,
          TasksActions.updateItem,
          TasksActions.addCategory,
          TasksActions.removeCategory
        ),
        withLatestFrom(this.#store, (action, state: IAppState) => ({
          action,
          state,
        })),
        map(({ action, state }) => {
          const type = action.type;
          if (type.startsWith('[Storage]')) {
            return fromPromise(this.#database.save('storage', state.storage));
          } else if (type.startsWith('[Shopping]')) {
            return fromPromise(this.#database.save('shopping', state.shopping));
          } else if (type.startsWith('[Globals]')) {
            return fromPromise(this.#database.save('globals', state.globals));
          } else if (type.startsWith('[Tasks]')) {
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
