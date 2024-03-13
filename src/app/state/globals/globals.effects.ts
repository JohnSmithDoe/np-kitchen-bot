import { inject, Injectable } from '@angular/core';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../../@types/types';
import { createGlobalItem, createGlobalItemFrom } from '../../app.factory';
import { matchesItem } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
import { updateQuickAddState } from '../@shared/item-list.effects';
import { EditGlobalItemActions } from '../edit-global-item/edit-global-item.actions';
import { selectEditGlobalState } from '../edit-global-item/edit-global-item.selector';
import { QuickAddActions } from '../quick-add/quick-add.actions';
import { GlobalsActions } from './globals.actions';
import { selectGlobalsState } from './globals.selector';

@Injectable({ providedIn: 'root' })
export class GlobalsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  clearFilter$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.updateMode),
      filter(({ mode }) => mode !== 'categories'),
      map(() => GlobalsActions.updateFilter())
    );
  });
  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addItem),
      map(() => GlobalsActions.updateSearch(''))
    );
  });

  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.updateItem),
      concatLatestFrom(() => this.#store.select(selectGlobalsState)),
      map(([{ item }, state]) => {
        let searchQueryAfter = state.searchQuery;
        if (!!item.name && !item.name.includes(state.searchQuery ?? '')) {
          searchQueryAfter = undefined;
        }
        return GlobalsActions.updateSearch(searchQueryAfter);
      })
    );
  });
  confirmGlobalItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(EditGlobalItemActions.confirmChanges),
      concatLatestFrom(() => this.#store.select(selectEditGlobalState)),
      map(([_, state]) => GlobalsActions.updateItem(state.item))
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const item = createGlobalItem(state.globals.searchQuery ?? '');
        return EditGlobalItemActions.showDialog(item);
      })
    );
  });
  updateQuickAdd$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.updateSearch),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }: { action: any; state: IAppState }) => {
        const newState = updateQuickAddState(
          state,
          marker('list-header.globals'),
          'global'
        );
        return QuickAddActions.updateState(newState);
      })
    );
  });

  addItemOrUpdateItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addOrUpdateItem),
      concatLatestFrom(() => this.#store.select(selectGlobalsState)),
      map(([{ item }, state]) => {
        if (matchesItem(item, state.items)) {
          console.log('found so update');
          return GlobalsActions.updateItem(item);
        }
        console.log('not found so add');
        return GlobalsActions.addItem(item);
      })
    );
  });

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addItemFromSearch),
      withLatestFrom(this.#store, (_: TypedAction<any>, state: IAppState) => ({
        state,
      })),
      map(({ state }) => {
        console.log('add item from search without dialog');
        const item = createGlobalItem(state.globals.searchQuery ?? '');
        return GlobalsActions.addOrUpdateItem(item);
      })
    );
  });
  addItemFromStorage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addStorageItem, GlobalsActions.addShoppingItem),
      map(({ item }) => {
        const globalItem = createGlobalItemFrom(item);
        return GlobalsActions.addOrUpdateItem(globalItem);
      })
    );
  });
  addItemFromShopping$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addShoppingItem),
      map(({ item }) => {
        console.log('add shopping item to storage');
        const globalItem = createGlobalItemFrom(item);
        return GlobalsActions.addOrUpdateItem(globalItem);
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          GlobalsActions.addItem,
          GlobalsActions.removeItem,
          GlobalsActions.updateItem
        ),
        concatLatestFrom(() => this.#store.select(selectGlobalsState)),
        map(([_, state]) => fromPromise(this.#database.save('globals', state)))
      );
    },
    { dispatch: false }
  );
}
