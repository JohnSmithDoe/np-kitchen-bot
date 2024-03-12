import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, exhaustMap, map, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, TAllItemTypes } from '../@types/types';
import { isShoppingItem, isStorageItem } from '../app.utils';
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
          StorageActions.addItemToList,
          StorageActions.copyToShoppinglist,
          ShoppingActions.addItemToList,
          GlobalsActions.addItemToList
        ),
        concatLatestFrom(() => this.#store),
        map(([{ item, type }, state]) => {
          const appState: IAppState = state;
          if (!item.name.length) return;
          // this next one is sadly not right since we add already existing items by raising the quantity...
          // const quantity = isGlobalItem(item) ? undefined : item.quantity;
          // need to get the current item
          let foundItem: TAllItemTypes | undefined;
          switch (type) {
            case '[Shopping] Add Item To List':
            case '[Storage] Copy To Shoppinglist':
              foundItem = appState.shopping.items.find(
                (sitem) => sitem.name === item.name
              );
              break;
            case '[Globals] Add Item To List':
              foundItem = appState.globals.items.find(
                (sitem) => sitem.name === item.name
              );
              break;
            case '[Storage] Add Item To List':
              foundItem = appState.storage.items.find(
                (sitem) => sitem.name === item.name
              );
              break;
          }
          const quantity =
            isStorageItem(foundItem) || isShoppingItem(foundItem)
              ? foundItem.quantity
              : 1;
          if (type === '[Storage] Copy To Shoppinglist') {
            return fromPromise(
              this.#uiService.showCopyToShoppingListToast(item.name, quantity)
            );
          }
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
}
