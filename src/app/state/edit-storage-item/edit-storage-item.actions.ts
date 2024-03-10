import { createActionGroup, emptyProps } from '@ngrx/store';
import { IStorageItem } from '../../@types/types';

export const EditStorageItemActions = createActionGroup({
  source: 'EditStorageItem',
  events: {
    'Show Dialog': (item?: IStorageItem) => ({ item }),
    'Update Item': (data: Partial<IStorageItem>) => ({ data }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
