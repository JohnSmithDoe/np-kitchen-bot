import { createActionGroup, emptyProps } from '@ngrx/store';
import { IDatastore } from '../@types/types';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    load: emptyProps(),
    loadedSuccessfully: (datastore: IDatastore) => ({ datastore }),
    save: emptyProps(),
  },
});
