export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;

export type TTimestamp = string;
// Todo
export interface IItemLocation {}
export interface IItemCategory<T extends IBaseItem = IBaseItem> {
  name: string;
  items: T[];
}

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
export interface IBaseItem {
  id: string;
  name: string;
  quantity: number;

  unit: TItemUnit;

  packaging: TPackagingUnit;
  packagingWeight?: number;

  category?: string[];

  price?: number;
  desc?: string;
  location?: string;
}

export interface IGlobalItem extends IBaseItem {
  bestBeforeTimespan: TBestBeforeTimespan;
  bestBeforeTimevalue?: number;
}

export interface ILocalItem extends IBaseItem {
  state?: 'bought';
  mdh?: TTimestamp;
}

export interface IItemList<T extends ILocalItem | IGlobalItem> {
  id: string;
  title: string;
  items: T[];
}

export interface IDatastore {
  all: IItemList<IGlobalItem> & {
    id: '_all';
    title: 'All Items';
  };
  storage: IItemList<ILocalItem> & {
    id: '_storage';
    title: 'Storage';
  };
  shoppinglists: IItemList<ILocalItem>[];
}
