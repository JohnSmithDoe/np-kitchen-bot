type NPTimestamp = string;
// Todo
export interface StorageLocation {}
export interface StorageUnit {}
export interface Recipe {}
//
export interface StorageItem {
  id: string;
  name: string;
  quantity: number;

  category?: string;
  price?: number;
  desc?: string;
  mdh?: NPTimestamp;
  location?: string;

}
export interface StorageItemList {
  id: string;
  title: string;
  items: StorageItem[];
}



export type NPIonDragEvent = CustomEvent<{amount: number, ratio: number}>

