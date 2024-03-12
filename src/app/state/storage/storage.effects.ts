import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { exhaustMap, filter, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../../@types/types';
import {
  createGlobalItem,
  createStorageItem,
  createStorageItemFromGlobal,
} from '../../app.factory';
import { marker } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { updateQuickAddState } from '../@shared/item-list.effects';
import { EditGlobalItemActions } from '../edit-global-item/edit-global-item.actions';
import { EditStorageItemActions } from '../edit-storage-item/edit-storage-item.actions';
import { selectEditStorageState } from '../edit-storage-item/edit-storage-item.selector';
import { QuickAddActions } from '../quick-add/quick-add.actions';
import { ShoppingActions } from '../shoppinglist/shopping.actions';
import { StorageActions } from './storage.actions';
import { selectStorageState } from './storage.selector';

@Injectable({ providedIn: 'root' })
export class StorageEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  clearFilter$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateMode),
      filter(({ mode }) => mode !== 'categories'),
      map(({ mode }) => StorageActions.updateFilter())
    );
  });
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
      map(({ item }) => ShoppingActions.addStorageItem(item))
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add item from search with edit dialog');
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return EditStorageItemActions.showDialog(item);
      })
    );
  });

  showCreateGlobalDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.showCreateGlobalDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        console.log('add global item from search with edit dialog');
        const item = createGlobalItem(state.storage.searchQuery ?? '');
        return EditGlobalItemActions.showDialog(item, '_storage');
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
  // get the categories for the dialog... hmm
  updateQuickAddStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.updateSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const newState = updateQuickAddState(
          state,
          marker('list-header.storage'),
          'storage'
        );
        return QuickAddActions.updateState(newState);
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
