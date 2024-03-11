import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { exhaustMap, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../../@types/types';
import { createStorageItem } from '../../app.factory';
import { DatabaseService } from '../../services/database.service';
import { EditStorageItemActions } from '../edit-storage-item/edit-storage-item.actions';
import { selectEditStorageState } from '../edit-storage-item/edit-storage-item.selector';
import { ShoppingListActions } from '../shoppinglist/shopping-list.actions';
import { StorageActions } from './storage.actions';
import { selectStorageState } from './storage.selector';

@Injectable({ providedIn: 'root' })
export class StorageEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  confirmStorageItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(EditStorageItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditStorageState)),
      map(([_, state]) => StorageActions.updateItem(state.item))
    );
  });

  moveToShoppingList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.moveToShoppinglist),
      map(({ item }) => ShoppingListActions.addStorageItem(item))
    );
  });

  showCreateDialogFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateDialogFromSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return EditStorageItemActions.showDialog(item);
      })
    );
  });

  saveStorageOnChange$ = this.createSaveEffect(
    'storage',
    selectStorageState,
    StorageActions.addItem,
    StorageActions.removeItem,
    StorageActions.updateItem
  );

  createSaveEffect<T extends keyof IDatastore>(
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
              take(1) // TODO: this closes the obs i think... should be done by better piping i guess
            )
          )
        );
      },
      { dispatch: false }
    );
  }
}
