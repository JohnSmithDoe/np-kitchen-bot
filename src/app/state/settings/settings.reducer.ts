import { createReducer, on } from '@ngrx/store';
import { ISettings } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { SettingsActions } from './settings.actions';

export const initialSettings: ISettings = {
  showQuickAdd: false,
  showQuickAddGlobal: false,
  showGlobalsInShopping: false,
  showGlobalsInStorage: false,
  showShoppingInGlobals: false,
  showShoppingInStorage: false,
  showStorageInGlobals: false,
  showStorageInShopping: false,
};

export const settingsReducer = createReducer(
  initialSettings,
  on(SettingsActions.updateSettings, (_state, { settings }) => {
    console.log('Update Settings', settings);
    return settings;
  }),
  on(ApplicationActions.loadedSuccessfully, (_state, { datastore }) => {
    console.log('Load Settings', datastore);
    return datastore.settings ?? _state;
  })
);
