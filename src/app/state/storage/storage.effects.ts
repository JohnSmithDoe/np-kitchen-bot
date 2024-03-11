import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { exhaustMap, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../../@types/types';
import {
  createStorageItem,
  createStorageItemFromGlobal,
} from '../../app.factory';
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

  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        StorageActions.addGlobalItem,
        StorageActions.addItemFromSearch,
        StorageActions.addItem
      ),
      map(() => StorageActions.updateSearch(''))
    );
  });

  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateItem),
      concatLatestFrom(() => this.#store.select(selectStorageState)),
      map(([{ item }, state]) => {
        console.log('update search for real');
        let searchQueryAfter = state.searchQuery;
        if (!!item.name && !item.name.includes(state.searchQuery ?? '')) {
          searchQueryAfter = undefined;
        }
        return StorageActions.updateSearch(searchQueryAfter);
      })
    );
  });

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

  editItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateDialogFromSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add item from search with edit dialog');
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return EditStorageItemActions.showDialog(item);
      })
    );
  });

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemFromSearch),
      withLatestFrom(this.#store, (_: TypedAction<any>, state: IAppState) => ({
        state,
      })),
      map(({ state }) => {
        console.log('add item from search without dialog');
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return StorageActions.addItem(item);
      })
    );
  });

  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addGlobalItem),
      map(({ item }) => {
        console.log('add global item to storage');
        const storageitem = createStorageItemFromGlobal(item);
        return StorageActions.addItem(storageitem);
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
