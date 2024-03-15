import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  IBaseItem,
  TAllItemTypes,
  TItemListCategory,
  TItemListId,
} from '../../@types/types';

export const DialogsActions = createActionGroup({
  source: 'Dialogs',
  events: {
    'Show Dialog': (
      item: TAllItemTypes,
      listId: TItemListId,
      additional?: TItemListId
    ) => ({
      item,
      listId,
      additional,
    }),
    'Update Item': (data: Partial<TAllItemTypes>) => ({ data }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Add Category': emptyProps(),
    'Toggle Category': (category: TItemListCategory) => ({ category }),
    'Remove Category': (category: TItemListCategory) => ({ category }),
    'Update Search Query': (query?: string) => ({ query }),
    'Update Selection': (item?: IBaseItem, items?: IBaseItem[]) => ({
      item,
      items,
    }),
    'Show Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
