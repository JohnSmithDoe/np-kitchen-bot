import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { exhaustMap, map, take } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IDatastore } from '../../@types/types';
import { DatabaseService } from '../../services/database.service';
import { SettingsActions } from './settings.actions';
import { selectSettingsState } from './settings.selector';

@Injectable({ providedIn: 'root' })
export class SettingsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);
  toggleFlag$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(SettingsActions.toggleFlag),
      concatLatestFrom(() => this.#store.select(selectSettingsState)),
      map(([{ flag }, settings]) => {
        console.log('toggle flag', flag);
        return SettingsActions.updateSettings({
          ...settings,
          [flag]: !settings[flag],
        });
      })
    );
  });

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
