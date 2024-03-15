import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
} from '../../app.factory';
import { matchesItemExactly } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { ShoppingActions } from './shopping.actions';
import { selectShoppingState } from './shopping.selector';

@Injectable({ providedIn: 'root' })
export class ShoppingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  clearFilter$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.updateMode),
      filter(({ mode }) => mode !== 'categories'),
      map(({ mode }) => ShoppingActions.updateFilter())
    );
  });

  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addItem),
      map(() => ShoppingActions.updateSearch(''))
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.updateItem),
      concatLatestFrom(() => this.#store.select(selectShoppingState)),
      map(([{ item }, state]) => {
        let searchQueryAfter = state.searchQuery;
        if (!!item.name && !item.name.includes(state.searchQuery ?? '')) {
          searchQueryAfter = undefined;
        }
        return ShoppingActions.updateSearch(searchQueryAfter);
      })
    );
  });

  addOrUpdateIteme$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addOrUpdateItem),
      concatLatestFrom(() => this.#store.select(selectShoppingState)),
      map(([{ item }, state]) => {
        if (matchesItemExactly(item, state.items)) {
          console.log('found so update');
          return ShoppingActions.updateItem(item);
        }
        console.log('not found so add');
        return ShoppingActions.addItem(item);
      })
    );
  });

  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addGlobalItem),
      map(({ item }) => {
        const shoppingItem = createShoppingItemFromGlobal(item);
        return ShoppingActions.addOrUpdateItem(shoppingItem);
      })
    );
  });
  addItemFromStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addStorageItem),
      map(({ item }) => {
        const shoppingItem = createShoppingItemFromStorage(item);
        return ShoppingActions.addOrUpdateItem(shoppingItem);
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          ShoppingActions.addItem,
          ShoppingActions.removeItem,
          ShoppingActions.updateItem
        ),
        concatLatestFrom(() => this.#store.select(selectShoppingState)),
        map(([_, state]) => fromPromise(this.#database.save('shopping', state)))
      );
    },
    { dispatch: false }
  );

  buyItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.buyItem),
      map(({ item }) =>
        ShoppingActions.updateItem({ ...item, state: 'bought' })
      )
    );
  });
}
