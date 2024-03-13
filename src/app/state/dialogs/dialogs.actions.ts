import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  TAllItemTypes,
  TItemListCategory,
  TItemListId,
} from '../../@types/types';

export const DialogsActions = createActionGroup({
  source: 'Dialogs',
  events: {
    'Show Dialog': (item: TAllItemTypes, listId: TItemListId) => ({
      item,
      listId,
    }),
    'Update Item': (data: Partial<TAllItemTypes>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
