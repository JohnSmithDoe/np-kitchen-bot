import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import {Datastore, StorageItem, StorageItemList} from "../@types/types";
import {uuidv4} from "../utils";


const INITIAL_DATA = [
  {id: '1', quantity: 0, name: "Apfel", category: ["Obst"]},
  {id: '2', quantity: 0, name: "Banane", category: ["Obst"]},
  {id: '3', quantity: 0, name: "Karotte", category: ["Gemüse"]},
  {id: '4', quantity: 0, name: "Ei", category: ["Protein"]},
  {id: '5', quantity: 0, name: "Milch", category: ["Milchprodukte"]},
  {id: '6', quantity: 0, name: "Brot", category: ["Getreideprodukte"]},
  {id: '7', quantity: 0, name: "Lachs", category: ["Fisch"]},
  {id: '8', quantity: 0, name: "Spinat", category: ["Gemüse"]},
  {id: '9', quantity: 0, name: "Huhn", category: ["Fleisch"]},
  {id: '10', quantity: 0, name: "Joghurt", category: ["Milchprodukte"]},
  {id: '11', quantity: 0, name: "Reis", category: ["Getreideprodukte"]},
  {id: '12', quantity: 0, name: "Tomate", category: ["Gemüse"]},
  {id: '13', quantity: 0, name: "Rindfleisch", category: ["Fleisch"]},
  {id: '14', quantity: 0, name: "Käse", category: ["Milchprodukte"]},
  {id: '15', quantity: 0, name: "Haferflocken", category: ["Getreideprodukte"]},
  {id: '16', quantity: 0, name: "Thunfisch", category: ["Fisch"]},
  {id: '17', quantity: 0, name: "Brokkoli", category: ["Gemüse"]},
  {id: '18', quantity: 0, name: "Schweinefleisch", category: ["Fleisch"]},
  {id: '19', quantity: 0, name: "Quark", category: ["Milchprodukte"]},
  {id: '20', quantity: 0, name: "Nudeln", category: ["Getreideprodukte"]},
  {id: '21', quantity: 0, name: "Heilbutt", category: ["Fisch"]},
  {id: '22', quantity: 0, name: "Paprika", category: ["Gemüse"]},
  {id: '23', quantity: 0, name: "Lammfleisch", category: ["Fleisch"]},
  {id: '24', quantity: 0, name: "Butter", category: ["Milchprodukte"]},
  {id: '25', quantity: 0, name: "Müsli", category: ["Getreideprodukte"]},
  {id: '26', quantity: 0, name: "Garnelen", category: ["Fisch"]},
  {id: '27', quantity: 0, name: "Zucchini", category: ["Gemüse"]},
  {id: '28', quantity: 0, name: "Pute", category: ["Fleisch"]},
  {id: '29', quantity: 0, name: "Milchreis", category: ["Milchprodukte"]},
  {id: '30', quantity: 0, name: "Quinoa", category: ["Getreideprodukte"]},
  {id: '31', quantity: 0, name: "Forelle", category: ["Fisch"]}
];

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  static readonly CNP_STORAGE_KEY = 'np-kitchen-helper';
  #store: Datastore = {
    all: {title: 'All Items', id:'_all', items: []} ,
    storage: {title: 'Inventory', id:'_storage', items: []} ,
    shoppinglists: [],
    categories: []
  }

  constructor(private storageService: Storage) {

  }

  async initialize() {
    await this.storageService.create();
    const stored = await this.storageService.get(DatabaseService.CNP_STORAGE_KEY);
    if (stored) this.#store = stored;
    if(!stored) {
      this.all.items = INITIAL_DATA;
      this.updateDatabase();
    }
  }

  async save() {
    this.updateDatabase();
    await this.storageService.set(DatabaseService.CNP_STORAGE_KEY, this.#store);

  }

  private updateDatabase() {
    this.#store.categories = [];
    this.all.items.forEach(item => {
      item.category?.forEach(category => {
        let cat = this.categories.find(aCategory => category === aCategory.name);
      if (!cat && item.category) {
        cat = {items: [item], name: category}
        this.categories.push(cat);
      } else {
        cat?.items.push(item);
      }
      })
    });
  }

  get all() {
    return this.#store.all;
  }

  get storage() {
    return this.#store.storage;
  }

  shoppinglist(id = 'default') {
    let list = this.#store.shoppinglists.find(list => list.id === id);
    if(!list) {
      list = {
        id, items: [], title: '',
      };
      this.#store.shoppinglists.push(list)
    }
    return list;
  }

  get categories() {
    return this.#store.categories;
  }

  createNewStorageItem(name = '', quantity = 0): StorageItem {
    return {id: uuidv4(), name, quantity};
  }

  async addItem(item: StorageItem | undefined, list: StorageItemList) {
    if (item) {
      // check duplicates
      const foundItem = list.items.find(aItem => aItem.id === item.id);
      if (foundItem) {
        foundItem.quantity++;
      } else {
        item.quantity = 1;
        list.items.push({...item})
      }
      return this.save();
    }
  }

  addToAllItems(item: StorageItem) {
    const gItem = this.#store.all.items.find(aItem => aItem.id === item.id);
    if(!gItem) {
      this.#store.all.items.push(item);
    }
  }

  async deleteItem(item: StorageItem, list: StorageItemList) {
    list.items.splice(list.items.findIndex(aItem => aItem.id === item.id ), 1);
    return this.save();
  }

  async reorder(list: StorageItemList, from: number, to: number) {
    const item = list.items.splice(from, 1);
    list.items.splice(to,0, ...item)
    return this.save();
  }
}
