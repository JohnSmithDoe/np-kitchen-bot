import { createActionGroup, emptyProps } from '@ngrx/store';
import { IStorageItem } from '../../@types/types';

export const EditGlobalItemActions = createActionGroup({
  source: 'EditGlobalItem',
  events: {
    'Show Dialog': (item?: IStorageItem) => ({ item }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': (item?: IStorageItem) => ({ item }),
    'Abort Changes': emptyProps(),
  },
});
