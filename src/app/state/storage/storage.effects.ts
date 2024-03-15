import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { createShoppingItemFromStorage } from '../../app.factory';
import { matchesItemExactly } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { ShoppingActions } from '../shopping/shopping.actions';
import { selectShoppingState } from '../shopping/shopping.selector';
import { StorageActions } from './storage.actions';

@Injectable({ providedIn: 'root' })
export class StorageEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

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
