import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
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
      map(([{ flag }, settings]) =>
        SettingsActions.updateSettings({
          ...settings,
          [flag]: !settings[flag],
        })
      )
    );
  });

  saveSettingsOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(SettingsActions.updateSettings),
        map(({ settings }) =>
          fromPromise(this.#database.save('settings', settings))
        )
      );
    },
    { dispatch: false }
  );
}
