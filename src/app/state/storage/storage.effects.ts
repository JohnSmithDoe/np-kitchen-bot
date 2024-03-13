import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../../@types/types';
import {
  createGlobalItem,
  createShoppingItemFromStorage,
  createStorageItem,
  createStorageItemFromGlobal,
  createStorageItemFromShopping,
} from '../../app.factory';
import { matchesItem } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { DialogsActions } from '../dialogs/dialogs.actions';
import { selectEditStorageState } from '../dialogs/dialogs.selector';
import { ShoppingActions } from '../shopping/shopping.actions';
import { StorageActions } from './storage.actions';
import { selectStorageState } from './storage.selector';

@Injectable({ providedIn: 'root' })
export class StorageEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  clearFilter$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateMode),
      filter(({ mode }) => mode !== 'categories'),
      map(({ mode }) => StorageActions.updateFilter())
    );
  });

  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemToList),
      map(() => StorageActions.updateSearch(''))
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateItem),
      concatLatestFrom(() => this.#store.select(selectStorageState)),
      map(([{ item }, state]) => {
        console.log('update search for real');
        let searchQueryAfter = state.searchQuery;
        if (!!item.name && !item.name.includes(state.searchQuery ?? '')) {
          searchQueryAfter = undefined;
        }
        return StorageActions.updateSearch(searchQueryAfter);
      })
    );
  });

  confirmStorageItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditStorageState)),
      map(([_, state]) => StorageActions.updateItem(state.item))
    );
  });
  copyToShoppingList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.copyToShoppinglist),
      map(({ item, type }) => {
        console.log(type, item);
        const shoppingItem = createShoppingItemFromStorage(item);
        return ShoppingActions.addItemOrIncreaseQuantity(shoppingItem);
      })
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add item from search with edit dialog');
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return DialogsActions.showDialog(item, '_storage');
      })
    );
  });
  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateGlobalDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add global item from search with edit dialog');
        const item = createGlobalItem(state.storage.searchQuery ?? '');
        return DialogsActions.showDialog(item, '_storage');
      })
    );
  });
  addOrUpdateIteme$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemToList),
      concatLatestFrom(() => this.#store.select(selectStorageState)),
      map(([{ item }, state]) => {
        if (matchesItem(item, state.items)) {
          console.log('found so update');
          return StorageActions.updateItem(item);
        }
        console.log('not found so add');
        return StorageActions.addItem(item);
      })
    );
  });

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemFromSearch),
      withLatestFrom(this.#store, (_: TypedAction<any>, state: IAppState) => ({
        state,
      })),
      map(({ state }) => {
        console.log('add item from search without dialog');
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return StorageActions.addItemToList(item);
      })
    );
  });
  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addGlobalItem),
      map(({ item }) => {
        console.log('add global item to storage');
        const storageitem = createStorageItemFromGlobal(item);
        return StorageActions.addItemToList(storageitem);
      })
    );
  });
  addItemFromShopping$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addShoppingItem),
      map(({ item }) => {
        console.log('add shopping item to storage');
        const storageitem = createStorageItemFromShopping(item);
        return StorageActions.addItemToList(storageitem);
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItem,
          StorageActions.removeItem,
          StorageActions.updateItem
        ),
        concatLatestFrom(() => this.#store.select(selectStorageState)),
        map(([_, state]) => fromPromise(this.#database.save('storage', state)))
      );
    },
    { dispatch: false }
  );
}
