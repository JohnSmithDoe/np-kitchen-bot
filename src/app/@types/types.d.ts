type NPTimestamp = string;
export interface StorageItem {
  id: string;
  name: string;
  quantity: number;

  category?: string;
  price?: number;
  desc?: string;
  mdh?: NPTimestamp;

}
export type NPIonDragEvent = CustomEvent<{amount: number, ratio: number}>

