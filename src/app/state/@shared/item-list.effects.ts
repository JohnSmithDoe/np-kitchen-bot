import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { IAppState, TItemListId } from '../../@types/types';
import { GlobalsActions } from '../globals/globals.actions';
import { ShoppingActions } from '../shopping/shopping.actions';
import { StorageActions } from '../storage/storage.actions';
import { TasksActions } from '../tasks/tasks.actions';
import { ItemListActions } from './item-list.actions';

const getActionsFromListId = (listId: TItemListId) => {
  //prettier-ignore
  switch (listId) {
    case '_storage':
      return StorageActions;
    case '_globals':
      return GlobalsActions;
    case '_shopping':
      return ShoppingActions;
    case '_tasks':
      return TasksActions;
  }
};

@Injectable({ providedIn: 'root' })
export class ItemListEffects {
  #store = inject(Store<IAppState>);
  #actions$ = inject(Actions);

  // 'Add Item From Search': (listId:TItemListId) => ({ listId }),
  addItemFromSearch = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.addItemFromSearch),
      map(({ listId }) => getActionsFromListId(listId).addItemFromSearch())
    );
  });
  // 'Update Filter': (listId:TItemListId, filterBy?: string) => ({ filterBy, listId }),
  updateFilter = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.updateFilter),
      map(({ listId, filterBy }) =>
        getActionsFromListId(listId).updateFilter(filterBy)
      )
    );
  });
  // 'Update Mode': (listId:TItemListId, mode?: TItemListMode) => ({ mode, listId }),
  updateMode = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.updateMode),
      map(({ listId, mode }) => getActionsFromListId(listId).updateMode(mode))
    );
  });
  // 'Update Sort': (listId:TItemListId, sortBy?:
  updateSort = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.updateSort),
      map(({ listId, sortBy, sortDir }) =>
        getActionsFromListId(listId).updateSort(sortBy, sortDir)
      )
    );
  });
  // 'Update Search': (listId:TItemListId, searchQuery?: string) => ({ searchQuery, listId }),
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.updateSearch),
      map(({ searchQuery, listId }) =>
        getActionsFromListId(listId).updateSearch(searchQuery)
      )
    );
  });
  // 'Add Global Item': (listId:TItemListId, item: IGlobalItem) => ({ item, listId }),
  addGlobalItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.addGlobalItem),
      map(({ item, listId }) => {
        switch (listId) {
          case '_storage':
            return StorageActions.addGlobalItem(item);
          case '_shopping':
            return ShoppingActions.addGlobalItem(item);
          case '_globals':
          case '_tasks':
          default:
            return ItemListActions.configurationError();
        }
      })
    );
  });
  // 'Add Storage Item': (listId:TItemListId, item: IStorageItem) => ({ item, listId }),
  addStorageItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.addStorageItem),
      map(({ item, listId }) => {
        switch (listId) {
          case '_globals':
            return GlobalsActions.addStorageItem(item);
          case '_shopping':
            return ShoppingActions.addStorageItem(item);
          case '_storage':
          case '_tasks':
          default:
            return ItemListActions.configurationError();
        }
      })
    );
  });
  // 'Add Shopping Item': (listId:TItemListId, item: IShoppingItem) => ({ item, listId }),
  addShoppingItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ItemListActions.addShoppingItem),
      map(({ item, listId }) => {
        switch (listId) {
          case '_storage':
            return StorageActions.addShoppingItem(item);
          case '_globals':
            return GlobalsActions.addShoppingItem(item);
          case '_shopping':
          case '_tasks':
          default:
            return ItemListActions.configurationError();
        }
      })
    );
  });
}
