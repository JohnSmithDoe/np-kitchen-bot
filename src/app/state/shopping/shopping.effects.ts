import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../../@types/types';
import {
  createGlobalItem,
  createShoppingItem,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
} from '../../app.factory';
import { matchesItem } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { DialogsActions } from '../dialogs/dialogs.actions';
import { selectEditShoppingState } from '../dialogs/dialogs.selector';
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

  confirmShoppingItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditShoppingState)),
      filter(([_, state]) => state.listId === '_shopping'),
      map(([_, state]) => ShoppingActions.addItemToList(state.item))
    );
  });
  buyItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.buyItem),
      map(({ item }) =>
        ShoppingActions.updateItem({ ...item, state: 'bought' })
      )
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createShoppingItem(state.shopping.searchQuery ?? '');
        return DialogsActions.showDialog(item, '_shopping');
      })
    );
  });
  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.showCreateGlobalDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createGlobalItem(state.shopping.searchQuery ?? '');
        return DialogsActions.showDialog(item, '_shopping');
      })
    );
  });

  // add or update item
  addItemToListOrUpdate$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addItemToList),
      concatLatestFrom(() => this.#store.select(selectShoppingState)),
      map(([{ item }, state]) => {
        if (matchesItem(item, state.items)) {
          console.log('found so update');
          return ShoppingActions.updateItem(item);
        }
        console.log('not found so add');
        return ShoppingActions.addItem(item);
      })
    );
  });
  addItemOrIncreaseQuantity$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addItemOrIncreaseQuantity),
      concatLatestFrom(() => this.#store.select(selectShoppingState)),
      map(([{ item }, state]) => {
        console.log('add item or inc effect', item.quantity);
        const found = matchesItem(item, state.items);
        if (found) {
          console.log('found so inc quantity', found.quantity + 1);
          return ShoppingActions.updateItem({
            ...found,
            quantity: found.quantity + 1,
          });
        }
        console.log('not found so add');
        return ShoppingActions.addItemToList(item);
      })
    );
  });
  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addItemFromSearch),
      withLatestFrom(this.#store, (_: TypedAction<any>, state: IAppState) => ({
        state,
      })),
      map(({ state }) => {
        const item = createShoppingItem(state.shopping.searchQuery ?? '');
        return ShoppingActions.addItemToList(item);
      })
    );
  });
  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addGlobalItem),
      map(({ item }) => {
        const shoppingItem = createShoppingItemFromGlobal(item);
        return ShoppingActions.addItemToList(shoppingItem);
      })
    );
  });
  addItemFromStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addStorageItem),
      map(({ item }) => {
        const shoppingItem = createShoppingItemFromStorage(item);
        return ShoppingActions.addItemToList(shoppingItem);
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
}
