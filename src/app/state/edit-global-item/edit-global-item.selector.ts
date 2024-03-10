import { createFeatureSelector } from '@ngrx/store';
import { IEditGlobalItemState } from '../../@types/types';

export const selectEditGlobalState =
  createFeatureSelector<IEditGlobalItemState>('editGlobalItem');
