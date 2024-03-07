import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Store } from '@ngrx/store';
import {
  IBaseItem,
  IDatastore,
  IItemList,
  ISearchResult,
  ISettings,
  IStorageItem,
} from '../@types/types';
import { ApplicationActions } from '../state/application.actions';
import { SettingsActions } from '../state/settings/settings.actions';
import { StorageActions } from '../state/storage/storage.actions';

export const CSTORAGE_KEY = 'np-kitchen-helper';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly #storageService = inject(Storage);
  readonly store = inject(Store);

  async initialize() {
    this.store.dispatch(ApplicationActions.load());
  }

  async create() {
    await this.#storageService.create();
    const initialData: IDatastore = {
      globals: await this.#loadAs('globals'),
      storage: await this.#loadAs('storage'),
      shoppinglist: await this.#loadAs('shoppinglist'),
      settings: await this.#loadAs('settings'),
    };
    return initialData;
  }
  async #loadAs<T extends keyof IDatastore>(key: T): Promise<IDatastore[T]> {
    return await this.#storageService.get('npkh-' + key);
  }

  async save<T extends keyof IDatastore>(key: T, value: IDatastore[T]) {
    console.log('44:save-', key, value);

    return await this.#storageService.set('npkh-' + key, value);
  }

  addStorageItem(item?: IStorageItem) {
    if (!item) return;
    this.store.dispatch(StorageActions.addItem(item));
  }

  updateStorageItem(item: IStorageItem) {
    this.store.dispatch(StorageActions.updateItem(item));
  }

  removeStorageItem(item: IStorageItem) {
    this.store.dispatch(StorageActions.removeItem(item));
  }

  search<T extends IBaseItem>(
    itemList: IItemList<T>,
    searchTerm?: string
  ): ISearchResult<T> | undefined {
    return;
    // if (!searchTerm || !searchTerm.length) return;
    //
    // const matchesName = (item: IBaseItem, other: IBaseItem) =>
    //   item.name.toLowerCase() === other.name.toLowerCase();
    // const matchesSearch = (item: IBaseItem) =>
    //   item.name.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesSearchExactly = (item: IBaseItem) =>
    //   item.name.toLowerCase() === searchTerm.toLowerCase();
    // const matchesCategory = (item: IBaseItem) =>
    //   (item.category?.findIndex(
    //     (cat) => cat.toLowerCase().indexOf(searchTerm) >= 0
    //   ) ?? -1) >= 0;
    //
    // const listItems = itemList.items.filter((item) => matchesSearch(item));
    //
    // const storageItems = this.storage.items.filter(
    //   (item) =>
    //     !listItems.find((litem) => matchesName(item, litem)) &&
    //     matchesSearch(item)
    // );
    //
    // const globalItemsByName = this.all.items.filter(
    //   (item) =>
    //     !listItems.find((litem) => matchesName(item, litem)) &&
    //     !storageItems.find((sitem) => matchesName(item, sitem)) &&
    //     matchesSearch(item)
    // );
    // const globalItemsByCat = this.all.items.filter(
    //   (item) =>
    //     !listItems.find((litem) => matchesName(item, litem)) &&
    //     !globalItemsByName.includes(item) &&
    //     matchesCategory(item)
    // );
    // const globalItems = [...globalItemsByName, ...globalItemsByCat];
    //
    // const all: IBaseItem[] = ([] as IBaseItem[])
    //   .concat(listItems)
    //   .concat(globalItems)
    //   .concat(storageItems);
    //
    // return {
    //   searchTerm,
    //   hasSearchTerm: !!searchTerm.length,
    //   foundInList: listItems.find((base) => matchesSearchExactly(base)),
    //   foundInGlobal: this.all.items.find((global) =>
    //     matchesSearchExactly(global)
    //   ),
    //   all,
    //   listItems,
    //   globalItems,
    //   storageItems,
    // };
  }

  reorder(list: IItemList<any>, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to, 0, ...item);
  }

  saveSettings(settings: ISettings) {
    this.store.dispatch(SettingsActions.updateSettings(settings));
  }
}
