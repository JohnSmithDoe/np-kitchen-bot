import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { IAppState, IBaseItem } from '../../@types/types';
import { CategoriesActions } from './categories.actions';
import { DialogsActions } from './dialogs.actions';

@Injectable({ providedIn: 'root' })
export class CategoriesEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  //TODO: could patch in addItem, removeItem, updateItem and update the categories
  // on load we could get them in sync with the items... :D

  // get the categories for the dialog... hmm see above
  showCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.showDialog),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const listItems: IBaseItem[] = ([] as IBaseItem[])
          .concat(state.globals.items)
          .concat(...state.storage.items)
          .concat(...state.shopping.items);

        return CategoriesActions.updateSelection(state.dialogs.item, listItems);
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
          category: state.dialogs.category.selection,
        };
        return DialogsActions.updateItem(updateData);
      })
    );
  });
}
