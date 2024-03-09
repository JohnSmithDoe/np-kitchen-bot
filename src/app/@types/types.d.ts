import { Color } from '@ionic/core/dist/types/interface';

// eslint-disable-next-line functional/type-declaration-immutability
export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;

export type TColor =
  | Color
  | 'global'
  | 'category'
  | 'storage'
  | 'shopping'
  | 'settings'
  | 'low-stock-warn'
  | 'low-stock';

export type TTimestamp = string;
// Todo
export interface IItemLocation {}
// eslint-disable-next-line functional/type-declaration-immutability
export type TItemListCategory = string;

// Orangensaft
// Einheit: milliliter
// Packung: Flasche
// Packungsinhalt: 1000ml

// Spaghetti
// Einheit: gramm
// Packung: Päckchen
// Packungsinhalt: 500g

export type TItemUnit = 'ml' | 'g' | 'pieces';
export type TPackagingUnit = 'bottle' | 'package' | 'loose' | 'tin-can';
export type TBestBeforeTimespan =
  | 'forever'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

//
export type IBaseItem = {
  id: string;
  name: string;
  createdAt: TTimestamp;

  category?: string[];

  price?: number;
  desc?: string;
  location?: string;
};

export interface IGlobalItem extends IBaseItem {
  unit: TItemUnit;
  packaging: TPackagingUnit;
  packagingWeight?: number;

  bestBeforeTimespan: TBestBeforeTimespan;
  bestBeforeTimevalue?: number;
}

export interface IShoppingItem extends IBaseItem {
  quantity: number;
  state: 'bought' | 'active';
}
export type TUpdateDTO<T extends IBaseItem> = IBaseItem &
  Partial<T> & { id: string };
export type TAllItemTypes =
  | IBaseItem
  | IGlobalItem
  | IShoppingItem
  | IStorageItem;
// export type IStorageItem = Readonly<
//   IBaseItem & {
//     quantity: number;
//     minAmount?: number;
//     bestBefore?: TTimestamp;
//   }
// >;
export type IStorageItem = IBaseItem & {
  quantity: number;
  minAmount?: number;
  bestBefore?: TTimestamp;
};

type TItemListSortType = 'name' | 'bestBefore';
type TItemListSortDir = 'asc' | 'desc';

export type TItemListSort = {
  sortDir: TItemListSortDir;
  sortBy: TItemListSortType;
};
export type TItemListMode = 'alphabetical' | 'categories';

export interface IItemList<T extends IBaseItem = IBaseItem> {
  id: string;
  title: string;
  items: T[];
  mode: TItemListMode;
  searchQuery?: string;
  filterBy?: string;
  sort?: TItemListSort;

  // these could be global maybe not data
  data?: TUpdateDTO<T>;
  isEditing?: boolean;
  editMode?: 'update' | 'create';
  isCreating?: boolean;
}

export interface ISettings {
  showQuickAdd: boolean;
  showQuickAddGlobal: boolean;
}

export type TStorageList = IItemList<IStorageItem> & {
  id: '_storage';
  title: 'Storage';
};
export type TGlobalsList = IItemList<IGlobalItem> & {
  id: '_globals';
  title: 'Global Items';
};
export type TShoppingList = IItemList<IShoppingItem> & {
  id: '_shopping';
  title: 'Shopping Items';
};

export interface IDatastore {
  globals: TGlobalsList;
  storage: TStorageList;
  shoppinglist: TShoppingList;
  settings: ISettings;
}

export interface ISearchResult<T extends IBaseItem> {
  listItems: T[];
  hasSearchTerm: boolean; // length of the searchTerm > 0
  searchTerm: string;
  showQuickAdd: boolean;
  showQuickAddGlobal: boolean;
  exactMatch?: T; // the item from the list where the name matches exactly
  foundInGlobal?: IGlobalItem; // the global item where name matches exactly
  all: IBaseItem[];
  globalItems: IGlobalItem[];
  storageItems: IStorageItem[];
}

export type IListState<T extends IBaseItem> = IItemList<T>;
export type IStorageState = Readonly<TStorageList>;
export type IShoppingState = Readonly<TShoppingList>;
export type IGlobalsState = Readonly<TGlobalsList>;
