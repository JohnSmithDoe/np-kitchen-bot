import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { IAppState, IBaseItem } from '../../@types/types';
import { CategoriesActions, DialogsActions } from './dialogs.actions';

@Injectable({ providedIn: 'root' })
export class DialogsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  showCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.showDialog),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const listItems: IBaseItem[] =
          state.dialogs.listId === '_tasks'
            ? state.tasks.items
            : ([] as IBaseItem[])
                .concat(state.globals.items)
                .concat(state.storage.items)
                .concat(state.shopping.items);
        return CategoriesActions.updateSelection(state.dialogs.item, listItems);
      })
    );
  });

  confirmCategories$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(CategoriesActions.confirmChanges),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ state }: { state: IAppState }) => {
        const updateData: Partial<IBaseItem> = {
          category: state.dialogs.category.selection,
        };
        return DialogsActions.updateItem(updateData);
      })
    );
  });
}
