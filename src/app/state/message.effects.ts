import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, exhaustMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { isGlobalItem } from '../app.utils';
import { UiService } from '../services/ui.service';
import { GlobalsActions } from './globals/globals.actions';
import { ShoppingListActions } from './shoppinglist/shopping-list.actions';
import { StorageActions } from './storage/storage.actions';

@Injectable({ providedIn: 'root' })
export class MessageEffects {
  #actions$ = inject(Actions);
  #uiService = inject(UiService);

  addItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItem,
          ShoppingListActions.addItem,
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
          StorageActions.endEditItem,
          ShoppingListActions.updateItem,
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
          ShoppingListActions.removeItem,
          GlobalsActions.removeItem
        ),
        exhaustMap(({ item }) => {
          return fromPromise(this.#uiService.showRemoveItemToast(item.name));
        })
      );
    },
    { dispatch: false }
  );
}
