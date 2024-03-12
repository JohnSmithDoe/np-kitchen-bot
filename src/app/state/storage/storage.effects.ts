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
  createStorageItem,
  createStorageItemFromGlobal,
} from '../../app.factory';
import { DatabaseService } from '../../services/database.service';
import { updateQuickAddState } from '../@shared/item-list.effects';
import { EditGlobalItemActions } from '../edit-global-item/edit-global-item.actions';
import { EditStorageItemActions } from '../edit-storage-item/edit-storage-item.actions';
import { selectEditStorageState } from '../edit-storage-item/edit-storage-item.selector';
import { QuickAddActions } from '../quick-add/quick-add.actions';
import { ShoppingActions } from '../shopping/shopping.actions';
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
      ofType(StorageActions.addItemToList),
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
  copyToShoppingList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.copyToShoppinglist),
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
  // message hook
  addItemToList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemToList),
      map(({ item }) => StorageActions.addItem(item))
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
        return StorageActions.addItemToList(item);
      })
    );
  });
  addItemFromGlobal$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addGlobalItem),
      map(({ item }) => {
        console.log('add global item to storage');
        const storageitem = createStorageItemFromGlobal(item);
        return StorageActions.addItemToList(storageitem);
      })
    );
  });

  updateQuickAdd$ = createEffect(() => {
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

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          StorageActions.addItem,
          StorageActions.removeItem,
          StorageActions.updateItem
        ),
        concatLatestFrom(() => this.#store.select(selectStorageState)),
        map(([_, state]) => fromPromise(this.#database.save('storage', state)))
      );
    },
    { dispatch: false }
  );
}
