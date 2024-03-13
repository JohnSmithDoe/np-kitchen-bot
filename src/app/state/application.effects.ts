import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { TItemListId } from '../@types/types';
import { DatabaseService } from '../services/database.service';
import { createQuickAddState } from './@shared/item-list.effects';
import { ApplicationActions } from './application.actions';
import { GlobalsActions } from './globals/globals.actions';
import { QuickAddActions } from './quick-add/quick-add.actions';
import { ShoppingActions } from './shopping/shopping.actions';
import { StorageActions } from './storage/storage.actions';

@Injectable({ providedIn: 'root' })
export class ApplicationEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ApplicationActions.load),
      combineLatestWith(fromPromise(this.#database.create())),
      map(([_, data]) => ApplicationActions.loadedSuccessfully(data))
    );
  });

  updateQuickAdd$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        ShoppingActions.updateSearch,
        StorageActions.updateSearch,
        GlobalsActions.updateSearch
      ),
      withLatestFrom(this.#store, (action, state) => ({ action, state })),
      map(({ action, state }) => {
        let listId: TItemListId;
        switch (action.type) {
          case '[Globals] Update Search':
            listId = '_globals';
            break;
          case '[Shopping] Update Search':
            listId = '_shopping';
            break;
          case '[Storage] Update Search':
            listId = '_storage';
            break;
        }
        const newState = createQuickAddState(state, listId);
        return QuickAddActions.updateState(newState);
      })
    );
  });
}
