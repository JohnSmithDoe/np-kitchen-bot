import { createActionGroup } from '@ngrx/store';
import { IShoppingItem } from '../../@types/types';

export const ShoppingListActions = createActionGroup({
  source: 'Shoppinglist',
  events: {
    'Add Item': (item: IShoppingItem, listID: string = 'default') => ({
      item,
      listID,
    }),
    'Remove Item': (item: IShoppingItem, listID: string = 'default') => ({
      item,
      listID,
    }),
    'Update Item': (item?: IShoppingItem, listID: string = 'default') => ({
      item,
      listID,
    }),
  },
});
