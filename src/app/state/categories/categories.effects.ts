import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { IAppState, IBaseItem } from '../../@types/types';
import { DatabaseService } from '../../services/database.service';
import { EditGlobalItemActions } from '../edit-global-item/edit-global-item.actions';
import { EditShoppingItemActions } from '../edit-shopping-item/edit-shopping-item.actions';
import { EditStorageItemActions } from '../edit-storage-item/edit-storage-item.actions';
import { CategoriesActions } from './categories.actions';

@Injectable({ providedIn: 'root' })
export class CategoriesEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);
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
          : state.editGlobalItem.isEditing
            ? EditGlobalItemActions.updateItem(updateData)
            : EditShoppingItemActions.updateItem(updateData);
      })
    );
  });
}
