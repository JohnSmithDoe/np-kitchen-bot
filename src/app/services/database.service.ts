import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as dayjs from 'dayjs';
import {
  IBaseItem,
  IDatastore,
  IGlobalItem,
  IItemList,
  IShoppingItem,
  IStorageItem,
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
  };

  async initialize() {
    await this.#storageService.create();
    const stored = await this.#storageService.get(
      DatabaseService.CNP_STORAGE_KEY
    );
    if (stored) this.#store = stored;
    if (!stored) {
      this.all.items = INITIAL_DATA;
      this.all.items = [];
      this.updateDatabase();
    }
  }

  async save() {
    this.updateDatabase();
    await this.#storageService.set(
      DatabaseService.CNP_STORAGE_KEY,
      this.#store
    );
  }

  private updateDatabase() {
    // // reset item references
    // this.categories.forEach((cat) => (cat.items = []));
    // // add all categories from all and link the items
    // this.all.items.forEach((item) => {
    //   item.category?.forEach((category) => {
    //     let cat = this.categories.find(
    //       (aCategory) => category === aCategory.name
    //     );
    //     if (!cat && item.category) {
    //       cat = { items: [item], name: category };
    //       this.categories.push(cat);
    //     } else {
    //       cat?.items.push(item);
    //     }
    //   });
    // });
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
  //TODO clean up
  async addItem(item: IStorageItem | undefined, list: IItemList<IStorageItem>) {
    let result = item;
    if (item) {
      // check duplicates
      result = list.items.find((aItem) => aItem.id === item.id);
      if (result) {
        result.quantity++;
      } else {
        item.quantity = 1;
        result = this.cloneItem(item);
        list.items.push(result);
      }
      await this.save();
    }
    return result;
  }
  async addItemShopping(
    item: IShoppingItem | undefined,
    list: IItemList<IShoppingItem>
  ) {
    let result = item;
    if (item) {
      // check duplicates
      result = list.items.find((aItem) => aItem.id === item.id);
      if (result) {
        result.quantity++;
      } else {
        item.quantity = 1;
        result = this.cloneItem(item);
        list.items.push(result);
      }
      await this.save();
    }
    return result;
  }

  async deleteItem(item: IBaseItem, list: IItemList) {
    list.items.splice(
      list.items.findIndex((aItem) => aItem.id === item.id),
      1
    );
    return this.save();
  }

  async reorder(list: IItemList<any>, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to, 0, ...item);
    return this.save();
  }

  async addOrUpdateGlobalItem(item: IGlobalItem) {
    const gItemIdx = this.#store.all.items.findIndex(
      (aItem) => aItem.id === item.id
    );
    // remove old if it exists and update copies
    if (gItemIdx >= 0) {
      this.#store.all.items.splice(gItemIdx, 1, item);
      this.#updateItem(item, this.#store.storage);
      this.#store.shoppinglists.forEach((list) => this.#updateItem(item, list));
    } else {
      this.#store.all.items.push(item);
    }
    return this.save();
  }

  #updateItem(item: IBaseItem, list: IItemList) {
    const value = list.items.find((listItem) => listItem.id === item.id);
    return value ? Object.assign(value, item) : undefined;
  }

  cloneItem<T extends IStorageItem | IGlobalItem>(item: T): T {
    return {
      ...item,
      category: item.category ? [...item.category] : undefined,
    };
  }

  //TODO: clean up
  async addOrUpdateStorageItem(
    item: IStorageItem | undefined,
    list: IItemList<IStorageItem>
  ) {
    if (!item) return;
    const updated = this.#updateItem(item, list);
    return !updated ? this.addItem(item, list) : this.save();
  }
  async addOrUpdateStorageItemShipping(
    item: IShoppingItem | undefined,
    list: IItemList<IShoppingItem>
  ) {
    if (!item) return;
    const updated = this.#updateItem(item, list);
    return !updated ? this.addItem(item, list) : this.save();
  }
}
