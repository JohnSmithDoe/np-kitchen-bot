import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../../@types/types';
import {
  createShoppingItemFromStorage,
  createStorageItem,
  createStorageItemFromGlobal,
  createStorageItemFromShopping,
} from '../../app.factory';
import { matchesItem } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { ShoppingActions } from '../shopping/shopping.actions';
import { selectShoppingState } from '../shopping/shopping.selector';
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
      ofType(StorageActions.addItem),
      map(() => StorageActions.updateSearch(''))
    );
  });

  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateItem),
      concatLatestFrom(() => this.#store.select(selectStorageState)),
      map(([{ item }, state]) => {
        let searchQueryAfter = state.searchQuery;
        if (!!item.name && !item.name.includes(state.searchQuery ?? '')) {
          searchQueryAfter = undefined;
        }
        return StorageActions.updateSearch(searchQueryAfter);
      })
    );
  });

  addOrUpdateItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addOrUpdateItem),
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
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return StorageActions.addOrUpdateItem(item);
      })
    );
  });

  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addGlobalItem),
      map(({ item }) => {
        const storageitem = createStorageItemFromGlobal(item);
        return StorageActions.addOrUpdateItem(storageitem);
      })
    );
  });
  addItemFromShopping$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addShoppingItem),
      map(({ item }) => {
        const storageitem = createStorageItemFromShopping(item);
        return StorageActions.addOrUpdateItem(storageitem);
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

  copyToShoppingList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.copyToShoppinglist),
      concatLatestFrom(() => this.#store.select(selectShoppingState)),
      map(([{ item }, state]) => {
        const shoppingItem = createShoppingItemFromStorage(item);
        const found = matchesItem(shoppingItem, state.items);
        if (found) {
          return ShoppingActions.updateItem({
            ...found,
            quantity: found.quantity + 1,
          });
        }
        return ShoppingActions.addOrUpdateItem(shoppingItem);
      })
    );
  });
}
