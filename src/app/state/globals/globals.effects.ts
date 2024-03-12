import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { exhaustMap, filter, map, take, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState, IDatastore } from '../../@types/types';
import { createGlobalItem } from '../../app.factory';
import { marker } from '../../app.utils';
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
      map(({ mode }) => GlobalsActions.updateFilter())
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
        console.log('update search for real');
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
        console.log('add item from search with edit dialog');
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

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(GlobalsActions.addItemFromSearch),
      withLatestFrom(this.#store, (_: TypedAction<any>, state: IAppState) => ({
        state,
      })),
      map(({ state }) => {
        console.log('add item from search without dialog');
        const item = createGlobalItem(state.globals.searchQuery ?? '');
        return GlobalsActions.addItem(item);
      })
    );
  });

  saveGlobalsOnChange$ = this.#createSaveEffect(
    'globals',
    selectGlobalsState,
    GlobalsActions.addItem,
    GlobalsActions.removeItem,
    GlobalsActions.updateItem
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
