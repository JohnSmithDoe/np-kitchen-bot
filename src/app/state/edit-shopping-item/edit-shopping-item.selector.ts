import { createFeatureSelector } from '@ngrx/store';
import { IEditShoppingItemState } from '../../@types/types';

export const selectEditShoppingState =
  createFeatureSelector<IEditShoppingItemState>('editShoppingItem');
