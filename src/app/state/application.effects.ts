import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../services/database.service';
import { ApplicationActions } from './application.actions';

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
}
