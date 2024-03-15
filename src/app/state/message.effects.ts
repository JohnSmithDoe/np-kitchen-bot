import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, exhaustMap, map, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { UiService } from '../services/ui.service';
import { GlobalsActions } from './globals/globals.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';
import { TasksActions } from './tasks/tasks.actions';

@Injectable({ providedIn: 'root' })
export class MessageEffects {
  #actions$ = inject(Actions);
  #uiService = inject(UiService);

  addItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItem,
          ShoppingActions.addItem,
          GlobalsActions.addItem,
          TasksActions.addItem
        ),
        map(({ item }) => {
          if (!item.name.length) return;
          return fromPromise(this.#uiService.showAddItemToast(item.name));
        })
      );
    },
    { dispatch: false }
  );

  addItemFailure$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItemFailure,
          GlobalsActions.addItemFailure,
          ShoppingActions.addItemFailure,
          TasksActions.addItemFailure
        ),
        exhaustMap(({ item }) => {
          return fromPromise(this.#uiService.showItemContainedToast(item.name));
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
          GlobalsActions.updateItem,
          TasksActions.updateItem
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
          GlobalsActions.removeItem,
          TasksActions.removeItem
        ),
        tap(({ item }) => {
          return this.#uiService.showRemoveItemToast(item.name);
        })
      );
    },
    { dispatch: false }
  );
}
