import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { exhaustMap, map, mergeMap, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../@types/types';
import { createStorageItem } from '../app.factory';
import { DatabaseService } from '../services/database.service';
import { ApplicationActions } from './application.actions';
import { EditGlobalItemActions } from './edit-global-item/edit-global-item.actions';
import { selectEditGlobalState } from './edit-global-item/edit-global-item.selector';
import { EditShoppingItemActions } from './edit-shopping-item/edit-shopping-item.actions';
import { selectEditShoppingState } from './edit-shopping-item/edit-shopping-item.selector';
import { EditStorageItemActions } from './edit-storage-item/edit-storage-item.actions';
import { selectEditStorageState } from './edit-storage-item/edit-storage-item.selector';
import { GlobalsActions } from './globals/globals.actions';
import { selectGlobalsState } from './globals/globals.selector';
import { SettingsActions } from './settings/settings.actions';
import { selectSettingsState } from './settings/settings.selector';
import { ShoppingListActions } from './shoppinglist/shopping-list.actions';
import { selectShoppinglistState } from './shoppinglist/shopping-list.selector';
import { StorageActions } from './storage/storage.actions';
import { selectStorageState } from './storage/storage.selector';

@Injectable({ providedIn: 'root' })
export class Effects {
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
  confirmShoppingItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(EditShoppingItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditShoppingState)),
      map(([_, state]) => ShoppingListActions.updateItem(state.item))
    );
  });
  confirmGlobalItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(EditGlobalItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      map(([_, state]) => GlobalsActions.updateItem(state.item))
    );
  });

  addStorageItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.addItemFromSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createStorageItem(state.storage.searchQuery ?? '');
        return StorageActions.addItem(item);
      })
    );
  });

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ApplicationActions.load),
      exhaustMap(() =>
        fromPromise(this.#database.create()).pipe(
          map((data) => ApplicationActions.loadedSuccessfully(data))
        )
      )
    );
  });

  // createGlobalAndAddAsStorageItem$ = createEffect(() => {
  //   return this.#actions$.pipe(
  //     ofType(StorageActions.createGlobalAndAddAsItem),
  //     mergeMap(({ data }) => [
  //       // GlobalsActions.createItem(data),
  //       // StorageActions.createItem(data),
  //       // StorageActions.endCreateGlobalItem(),
  //     ])
  //   );
  // });

  createGlobalAndAddAsShoppingItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.createGlobalAndAddAsItem),
      mergeMap(({ data }) => [
        GlobalsActions.createItem(data),
        ShoppingListActions.createItem(data),
        ShoppingListActions.endCreateGlobalItem(),
      ])
    );
  });

  moveToShoppingList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(StorageActions.moveToShoppinglist),
      map(({ item }) => ShoppingListActions.addStorageItem(item))
    );
  });

  saveStorageOnChange$ = this.#createSaveEffect(
    'storage',
    selectStorageState,
    StorageActions.addItem,
    StorageActions.removeItem,
    StorageActions.updateItem,
    StorageActions.endCreateGlobalItem,
    StorageActions.createGlobalAndAddAsItem
  );

  saveGlobalsOnChange$ = this.#createSaveEffect(
    'globals',
    selectGlobalsState,
    GlobalsActions.addItem,
    GlobalsActions.removeItem,
    GlobalsActions.updateItem,
    GlobalsActions.createItem,
    GlobalsActions.createAndEditItem,
    GlobalsActions.addItemFromSearch,
    GlobalsActions.endEditItem
  );

  saveShoppinglistOnChange$ = this.#createSaveEffect(
    'shoppinglist',
    selectShoppinglistState,
    ShoppingListActions.addItem,
    ShoppingListActions.removeItem,
    ShoppingListActions.updateItem,
    ShoppingListActions.addStorageItem,
    ShoppingListActions.createGlobalAndAddAsItem,
    ShoppingListActions.addItemFromSearch,
    ShoppingListActions.endCreateGlobalItem
  );

  saveSettingsOnChange$ = this.#createSaveEffect(
    'settings',
    selectSettingsState,
    SettingsActions.updateSettings
  );

  #createSaveEffect<T extends keyof IDatastore>(
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
