import { createFeatureSelector } from '@ngrx/store';
import { IStorageItem } from '../@types/types';

export const selectStorageList =
  createFeatureSelector<ReadonlyArray<IStorageItem>>('storage');
