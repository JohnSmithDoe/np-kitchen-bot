import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as dayjs from 'dayjs';
import { BehaviorSubject } from 'rxjs';
import {
  IBaseItem,
  IDatastore,
  IGlobalItem,
  IItemList,
  ISearchResult,
} from '../@types/types';

const INITIAL_DATA: IGlobalItem[] = [
  {
    id: '1',
    name: 'Apfel',
    category: ['Obst'],
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '2',
    name: 'Banane',
    category: ['Obst'],
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '3',
    name: 'Karotte',
    category: ['Gemüse'],
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '4',
    name: 'Eier',
    category: ['Protein'],
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '5',
    name: 'Milch',
    category: ['Milchprodukte'],
    unit: 'ml',
    packaging: 'bottle',
    packagingWeight: 1000,
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '6',
    name: 'Brot',
    category: ['Getreideprodukte'],
    unit: 'pieces',
    packaging: 'loose',
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  {
    id: '8',
    name: 'Rahmspinat',
    category: ['Gemüse'],
    unit: 'g',
    packaging: 'package',
    packagingWeight: 750,
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  // {id: '10', quantity: 0, name: "Joghurt", category: ["Milchprodukte"]},
  // {id: '11', quantity: 0, name: "Reis", category: ["Getreideprodukte"]},
  // {id: '12', quantity: 0, name: "Tomate", category: ["Gemüse"]},
  // {id: '14', quantity: 0, name: "Käse", category: ["Milchprodukte"]},
  // {id: '15', quantity: 0, name: "Haferflocken", category: ["Getreideprodukte"]},
  {
    id: '16',
    name: 'Thunfisch',
    category: ['Fisch'],
    unit: 'g',
    packaging: 'tin-can',
    packagingWeight: 220,
    bestBeforeTimespan: 'forever',
    createdAt: dayjs().format(),
  },
  // {id: '17', quantity: 0, name: "Brokkoli", category: ["Gemüse"]},
  // {id: '19', quantity: 0, name: "Quark", category: ["Milchprodukte"]},
  // {id: '20', quantity: 0, name: "Nudeln", category: ["Getreideprodukte"]},
  // {id: '22', quantity: 0, name: "Paprika", category: ["Gemüse"]},
  // {id: '24', quantity: 0, name: "Butter", category: ["Milchprodukte"]},
  // {id: '25', quantity: 0, name: "Müsli", category: ["Getreideprodukte"]},
  // {id: '27', quantity: 0, name: "Zucchini", category: ["Gemüse"]},
  // {id: '29', quantity: 0, name: "Milchreis", category: ["Milchprodukte"]},
];

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  static readonly CNP_STORAGE_KEY = 'np-kitchen-helper';

  readonly #storageService = inject(Storage);

  #store: IDatastore = {
    all: { title: 'All Items', id: '_all', items: [] },
    storage: { title: 'Storage', id: '_storage', items: [] },
    shoppinglists: [],
    settings: {
      showQuickAdd: true,
      showQuickAddGlobal: false,
    },
  };

  readonly save$ = new BehaviorSubject<boolean>(false);

  async initialize() {
    await this.#storageService.create();
    const stored = await this.#storageService.get(
      DatabaseService.CNP_STORAGE_KEY
    );
    if (stored) this.#store = stored;
    if (!stored) {
      this.all.items = INITIAL_DATA;
      this.all.items = [];
    }
    if (!this.#store.settings) {
      this.#store.settings = {
        showQuickAdd: true,
        showQuickAddGlobal: false,
      };
    }
  }

  async save() {
    await this.#storageService.set(
      DatabaseService.CNP_STORAGE_KEY,
      this.#store
    );
    this.save$.next(true);
  }

  async addItem<T extends IBaseItem>(item: T | undefined, list: IItemList<T>) {
    let result = item;
    if (item) {
      // check duplicates
      result = list.items.find((aItem) => aItem.id === item.id);
      if (!result) {
        result = this.cloneItem(item);
        list.items.push(result);
      }
      await this.save();
    }
    return result;
  }

  #updateItem<T extends IBaseItem>(item: T, list: IItemList<T>) {
    const idx = list.items.findIndex((listItem) => listItem.id === item.id);
    if (idx >= 0) {
      list.items.splice(
        idx,
        1,
        this.cloneItem(Object.assign(list.items[idx], item))
      );
    }
    return idx >= 0 ? list.items[idx] : undefined;
  }

  async deleteItem(item: IBaseItem, list: IItemList) {
    list.items.splice(
      list.items.findIndex((aItem) => aItem.id === item.id),
      1
    );
    return this.save();
  }

  async addOrUpdateItem<T extends IBaseItem>(
    item: T | undefined,
    list: IItemList<T>
  ) {
    if (!item) return;
    const updated = this.#updateItem(item, list);
    return !updated ? this.addItem(item, list) : this.save();
  }

  cloneItem<T extends IBaseItem>(item: T): T {
    return {
      ...item,
      category: item.category ? [...item.category] : undefined,
    };
  }

  search<T extends IBaseItem>(
    itemList: IItemList<T>,
    searchTerm?: string
  ): ISearchResult<T> | undefined {
    if (!searchTerm || !searchTerm.length) return;

    const matchesName = (item: IBaseItem, other: IBaseItem) =>
      item.name.toLowerCase() === other.name.toLowerCase();
    const matchesSearch = (item: IBaseItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = (item: IBaseItem) =>
      (item.category?.findIndex(
        (cat) => cat.toLowerCase().indexOf(searchTerm) >= 0
      ) ?? -1) >= 0;

    const listItems = itemList.items.filter((item) => matchesSearch(item));
    const globalItemsByName = this.all.items.filter(
      (item) =>
        !listItems.find((litem) => matchesName(item, litem)) &&
        matchesSearch(item)
    );
    const globalItemsByCat = this.all.items.filter(
      (item) =>
        !listItems.find((litem) => matchesName(item, litem)) &&
        !globalItemsByName.includes(item) &&
        matchesCategory(item)
    );
    const globalItems = [...globalItemsByName, ...globalItemsByCat];
    // .filter((item, idx, curr) => matchesCategory(item, curr));
    const storageItems = this.storage.items.filter(
      (item) =>
        !listItems.find((litem) => matchesName(item, litem)) &&
        !globalItems.find((gitem) => matchesName(item, gitem)) &&
        matchesSearch(item)
    );

    return {
      searchTerm,
      hasSearchTerm: !!searchTerm.length,
      listItems,
      globalItems,
      storageItems,
    };
  }

  async reorder(list: IItemList<any>, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to, 0, ...item);
    return this.save();
  }

  // Getter

  get settings() {
    return this.#store.settings;
  }

  get all() {
    return this.#store.all;
  }

  get storage() {
    return this.#store.storage;
  }

  shoppinglist(id = 'default') {
    let list = this.#store.shoppinglists.find((list) => list.id === id);
    if (!list) {
      list = {
        id,
        items: [],
        title: '',
      };
      this.#store.shoppinglists.push(list);
    }
    return list;
  }
}
