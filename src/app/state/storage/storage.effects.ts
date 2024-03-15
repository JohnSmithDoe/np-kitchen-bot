import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  createShoppingItemFromStorage,
  createStorageItemFromGlobal,
  createStorageItemFromShopping,
} from '../../app.factory';
import { matchesItemExactly } from '../../app.utils';
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
        if (matchesItemExactly(item, state.items)) {
          console.log('found so update');
          return StorageActions.updateItem(item);
        }
        console.log('not found so add');
        return StorageActions.addItem(item);
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
        const found = matchesItemExactly(shoppingItem, state.items);
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
