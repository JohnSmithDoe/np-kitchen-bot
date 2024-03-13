import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, exhaustMap, map, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../@types/types';
import { UiService } from '../services/ui.service';
import { GlobalsActions } from './globals/globals.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';

@Injectable({ providedIn: 'root' })
export class MessageEffects {
  #actions$ = inject(Actions);
  #uiService = inject(UiService);
  #store = inject(Store<IAppState>);

  addItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          ShoppingActions.addItemToList,

          GlobalsActions.addShoppingItem,
          GlobalsActions.addStorageItem
        ),
        map(({ item }) => {
          if (!item.name.length) return;
          return fromPromise(
            this.#uiService.showAddItemToast(item.name, item.quantity)
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
          return fromPromise(this.#uiService.showUpdateItemToast(item));
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
}
