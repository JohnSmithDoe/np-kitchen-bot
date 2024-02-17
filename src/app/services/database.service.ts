import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import {StorageItem} from "../@types/types";
import {uuidv4} from "../utils";

interface NPDatabase {
  items: StorageItem[];
  storage: StorageItem[];
  shoppinglist: StorageItem[];
  categories: { name: string; items: StorageItem[] }[]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  static readonly CNP_STORAGE_KEY = 'np-kitchen-helper';
  #store: NPDatabase = {
    items: [],
    storage: [],
    shoppinglist: [],
    categories: []
  }

  constructor(private storageService: Storage) {

  }

  async initialize() {
    await this.storageService.create();
    const stored = await this.storageService.get(DatabaseService.CNP_STORAGE_KEY);
    if (stored) this.#store = stored;
    console.log('jo ho', stored, this.#store);
  }

  async save() {
    this.updateDatabase();
    await this.storageService.set(DatabaseService.CNP_STORAGE_KEY, this.#store);

  }

  private updateDatabase() {
    this.#store.categories = [];
    this.items.forEach(item => {
      let cat = this.categories.find(category => category.name === item.category);
      if (!cat && item.category) {
        cat = {items: [item], name: item.category}
        this.categories.push(cat);
      } else {
        cat?.items.push(item);
      }
    });
  }

  get items() {
    return this.#store.items;
  }

  get storage() {
    return this.#store.storage;
  }

  get shoppinglist() {
    return this.#store.shoppinglist;
  }

  get categories() {
    return this.#store.categories;
  }

  createNewStorageItem(name = '', quantity = 0): StorageItem {
    return {id: uuidv4(), name, quantity};
  }

  saveItem(item: StorageItem) {
    this.#store.items.push(item);
    return this.save();
  }
}
