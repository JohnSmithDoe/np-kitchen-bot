import { inject, Injectable } from '@angular/core';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
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
        return EditShoppingItemActions.showDialog(item);
      })
    );
  });
  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.showCreateGlobalDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createGlobalItem(state.shopping.searchQuery ?? '');
        return EditGlobalItemActions.showDialog(item, '_shopping');
      })
    );
  });

  addItemToList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingActions.addItemToList),
      map(({ item }) => {
        return ShoppingActions.addItem(item);
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
