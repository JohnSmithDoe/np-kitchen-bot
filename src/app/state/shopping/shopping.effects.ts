import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { exhaustMap, filter, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../../@types/types';
import {
  createGlobalItem,
  createShoppingItem,
  createShoppingItemFromGlobal,
  createShoppingItemFromStorage,
} from '../../app.factory';
import { marker } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { updateQuickAddState } from '../@shared/item-list.effects';
import { EditGlobalItemActions } from '../edit-global-item/edit-global-item.actions';
import { EditShoppingItemActions } from '../edit-shopping-item/edit-shopping-item.actions';
import { selectEditShoppingState } from '../edit-shopping-item/edit-shopping-item.selector';
import { QuickAddActions } from '../quick-add/quick-add.actions';
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
        console.log('update search for real');
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
      ofType(EditShoppingItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditShoppingState)),
      map(([_, state]) => ShoppingActions.updateItem(state.item))
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add item from search with edit dialog');
        const item = createShoppingItem(state.shopping.searchQuery ?? '');
        return EditShoppingItemActions.showDialog(item);
      })
    );
  });

  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.showCreateGlobalDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add global item from search with edit dialog');
        const item = createGlobalItem(state.shopping.searchQuery ?? '');
        return EditGlobalItemActions.showDialog(item, '_shopping');
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
        console.log('add item from search without dialog');
        const item = createShoppingItem(state.shopping.searchQuery ?? '');
        return ShoppingActions.addItem(item);
      })
    );
  });

  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addGlobalItem),
      map(({ item }) => {
        console.log('add global item to shopping');
        const shoppingItem = createShoppingItemFromGlobal(item);
        return ShoppingActions.addItem(shoppingItem);
      })
    );
  });
  addItemFromStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addStorageItem),
      map(({ item }) => {
        console.log('add storage item to shopping');
        const shoppingItem = createShoppingItemFromStorage(item);
        return ShoppingActions.addItem(shoppingItem);
      })
    );
  });

  updateQuickAdd$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.updateSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const newState = updateQuickAddState(
          state,
          marker('list-header.shopping'),
          'shopping'
        );
        return QuickAddActions.updateState(newState);
      })
    );
  });

  saveShoppinglistOnChange$ = this.#createSaveEffect(
    'shopping',
    selectShoppingState,
    ShoppingActions.addItem,
    ShoppingActions.removeItem,
    ShoppingActions.updateItem
  );
  #createSaveEffect<T extends keyof IDatastore>(
    storageKey: T,
    select: (state: any) => IDatastore[T],
    ...events: ActionCreator<any>[]
  ) {
    return createEffect(
      () => {
        return this.#actions$.pipe(
          ofType(...events),
          exhaustMap(() =>
            this.#store.select(select).pipe(
              map((value) =>
                fromPromise(this.#database.save(storageKey, value))
              ),
              take(1)
            )
          )
        );
      },
      { dispatch: false }
    );
  }
}
