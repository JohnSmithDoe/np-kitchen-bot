import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, exhaustMap, map, mergeMap, take, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { isGlobalItem } from '../app.utils';
import { UiService } from '../services/ui.service';
import { GlobalsActions } from './globals/globals.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { selectShoppingList } from './shopping/shopping.selector';
import { StorageActions } from './storage/storage.actions';

@Injectable({ providedIn: 'root' })
export class MessageEffects {
  #actions$ = inject(Actions);
  #uiService = inject(UiService);
  #store = inject(Store);

  addItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItem,
          ShoppingActions.addItem,
          GlobalsActions.addItem
        ),
        exhaustMap(({ item }) => {
          const quantity = isGlobalItem(item) ? undefined : item.quantity;
          return fromPromise(
            this.#uiService.showAddItemToast(item.name, quantity)
          );
        })
      );
    },
    { dispatch: false }
  );

  updateItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.updateItem,
          ShoppingActions.updateItem,
          GlobalsActions.updateItem
        ),
        exhaustMap(({ item }) => {
          if (!item) return EMPTY;
          return fromPromise(
            this.#uiService.showUpdateItemToast(item.name ?? '')
          );
        })
      );
    },
    { dispatch: false }
  );

  removeItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.removeItem,
          ShoppingActions.removeItem,
          GlobalsActions.removeItem
        ),
        tap(({ item }) => {
          return this.#uiService.showRemoveItemToast(item.name);
        })
      );
    },
    { dispatch: false }
  );

  moveToShoppingListSuccess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(ShoppingActions.addStorageItem),
        mergeMap(({ data }) => {
          return this.#store.select(selectShoppingList).pipe(
            map((i) => i.find((a) => a.name === data.name)),
            map((item) => {
              return fromPromise(
                this.#uiService.showMovedToShoppingListToast(
                  item?.name ?? 'Error',
                  item?.quantity ?? -1
                )
              );
            }),
            take(1)
          );
        })
      );
    },
    { dispatch: false }
  );
}
