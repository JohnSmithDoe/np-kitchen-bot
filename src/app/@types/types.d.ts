import { Color } from '@ionic/core/dist/types/interface';

export type BooleanKeys<T> = {
  [k in keyof T]: T[k] extends boolean ? k : never;
}[keyof T];

// eslint-disable-next-line functional/type-declaration-immutability
export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;
export type TMarker = string;
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
export type TAllItemTypes = IGlobalItem | IShoppingItem | IStorageItem;

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

export type TItemListId = '_storage' | '_globals' | '_shopping';

export interface IItemList<T extends TAllItemTypes> {
  id: TItemListId;
  title: string;
  items: T[];
  mode: TItemListMode;
  searchQuery?: string;
  filterBy?: string;
  sort?: TItemListSort;
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

export type IStorageState = Readonly<TStorageList>;
export type IShoppingState = Readonly<TShoppingList>;
export type IGlobalsState = Readonly<TGlobalsList>;
export type IListState<T extends TAllItemTypes> = IItemList<T>;

export interface ISettings {
  showQuickAdd: boolean;
  showQuickAddGlobal: boolean;
  showGlobalsInStorage: boolean;
  showShoppingInStorage: boolean;

  showGlobalsInShopping: boolean;
  showStorageInShopping: boolean;

  showStorageInGlobals: boolean;
  showShoppingInGlobals: boolean;
}

export interface IDatastore {
  globals: TGlobalsList;
  storage: TStorageList;
  shopping: TShoppingList;
  settings: ISettings;
}
// hmm clean up this and myba add a quick add state
export interface ISearchResult<T extends IBaseItem> {
  listItems: T[];
  hasSearchTerm: boolean; // length of the searchTerm > 0
  searchTerm: string;
  exactMatch?: T; // the item from the list where the name matches exactly
  globalItems: IGlobalItem[];
  storageItems: IStorageItem[];
  shoppingItems: IShoppingItem[];
}

export type ICategoriesState = Readonly<{
  categories: TItemListCategory[];
  selection: TItemListCategory[];
  searchQuery?: string;
  isSelecting?: boolean;
}>;

export type TEditItemMode = 'update' | 'create';
export type IEditItemState<T extends IBaseItem> = Readonly<{
  item: T;
  listId: TItemListId;
  isEditing?: boolean;
  editMode?: TEditItemMode;
  dialogTitle?: string;
  saveButtonText?: string;
  category: ICategoriesState;
}>;
export type TDialogsState = IEditItemState<TAllItemTypes>;
export type IEditStorageItemState = IEditItemState<IStorageItem>;
export type IEditShoppingItemState = IEditItemState<IShoppingItem>;
export type IEditGlobalItemState = IEditItemState<IGlobalItem> & {
  addTo?: TItemListId;
};

export type IQuickAddState = Readonly<{
  listName?: string;
  color?: TColor;
  searchQuery?: string;
  exactMatchLocal?: boolean;
  exactMatchGlobal?: boolean;
}>;

export interface IAppState {
  settings: ISettings;
  storage: IStorageState;
  shopping: IShoppingState;
  globals: IGlobalsState;
  categories: ICategoriesState;
  dialogs: TDialogsState;
  editShoppingItem: IEditShoppingItemState;
  editGlobalItem: IEditGlobalItemState;
  quickadd: IQuickAddState;
}
