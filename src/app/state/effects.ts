import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { exhaustMap, filter, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  IAppState,
  IBaseItem,
  IDatastore,
  IQuickAddState,
  TColor,
  TMarker,
} from '../@types/types';
import { marker } from '../app.utils';
import { DatabaseService } from '../services/database.service';
import { ApplicationActions } from './application.actions';
import { CategoriesActions } from './categories/categories.actions';
import { EditGlobalItemActions } from './edit-global-item/edit-global-item.actions';
import { selectEditGlobalState } from './edit-global-item/edit-global-item.selector';
import { EditShoppingItemActions } from './edit-shopping-item/edit-shopping-item.actions';
import { selectEditShoppingState } from './edit-shopping-item/edit-shopping-item.selector';
import { EditStorageItemActions } from './edit-storage-item/edit-storage-item.actions';
import { GlobalsActions } from './globals/globals.actions';
import { selectGlobalsState } from './globals/globals.selector';
import { QuickAddActions } from './quick-add/quick-add.actions';
import { SettingsActions } from './settings/settings.actions';
import { selectSettingsState } from './settings/settings.selector';
import { ShoppingListActions } from './shoppinglist/shopping-list.actions';
import { selectShoppinglistState } from './shoppinglist/shopping-list.selector';
import { StorageActions } from './storage/storage.actions';

function updateQuickAddState(
  state: IAppState,
  listName: TMarker,
  color: TColor
): IQuickAddState {
  const searchQuery = state.storage.searchQuery;
  return {
    searchQuery,
    exactMatchLocal: !!state.storage.items.find(
      (item) => item.name.toLowerCase() === searchQuery
    ),
    exactMatchGlobal: !!state.globals.items.find(
      (item) => item.name.toLowerCase() === searchQuery
    ),
    listName,
    color,
  };
}

@Injectable({ providedIn: 'root' })
export class Effects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

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

  // get the categories for the dialog... hmm
  updateQuickAdd$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ShoppingListActions.updateSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const newState = updateQuickAddState(
          state,
          marker('list-header.shopping'),
          'shopping'
        );
        return QuickAddActions.updateState(newState);
      })
    );
  });

  // get the categories for the dialog... hmm
  showCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.showDialog),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const editItem: IBaseItem = state.editStorageItem.isEditing
          ? state.editStorageItem.item
          : state.editShoppingItem.isEditing
            ? state.editShoppingItem.item
            : state.editGlobalItem.item;
        const listItems: IBaseItem[] = state.editStorageItem.isEditing
          ? state.storage.items
          : state.editShoppingItem.isEditing
            ? state.shoppinglist.items
            : state.globals.items;

        return CategoriesActions.updateSelection(editItem, listItems);
      })
    );
  });
  // get the selected categories hmm
  confirmCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.confirmChanges),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const updateData: Partial<IBaseItem> = {
          category: state.categories.selection,
        };
        return state.editStorageItem.isEditing
          ? EditStorageItemActions.updateItem(updateData)
          : EditGlobalItemActions.updateItem(updateData);
      })
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
  confirmGlobalItemAndAddToList$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(EditGlobalItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      filter(([action, state]) => state.listId === '_storage'),
      map(([_, state]) => StorageActions.addGlobalItem(state.item))
    );
  });

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
