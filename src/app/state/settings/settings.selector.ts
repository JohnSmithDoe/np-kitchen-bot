import { createFeatureSelector } from '@ngrx/store';
import { ISettings } from '../../@types/types';

export const selectSettingsState = createFeatureSelector<ISettings>('settings');
