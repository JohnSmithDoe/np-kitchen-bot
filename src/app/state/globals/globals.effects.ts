import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { filter, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../../@types/types';
import { createGlobalItem, createGlobalItemFrom } from '../../app.factory';
import { matchesItem } from '../../app.utils';
import { DatabaseService } from '../../services/database.service';
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

  addOrUpdateItem$ = createEffect(() => {
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
