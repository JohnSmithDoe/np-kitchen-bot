import { AbstractControl } from '@angular/forms';
import { InputCustomEvent } from '@ionic/angular';
import {
  IBaseItem,
  IGlobalItem,
  IShoppingItem,
  IStorageItem,
  TAllItemTypes,
  TIonDragEvent,
} from './@types/types';

// type guards
export function isGlobalItem(value: TAllItemTypes): value is IGlobalItem {
  return value.hasOwnProperty('unit');
}
export function isStorageItem(value?: TAllItemTypes): value is IStorageItem {
  return !!value?.hasOwnProperty('bestBefore');
}
export function isShoppingItem(value?: TAllItemTypes): value is IShoppingItem {
  return !!value?.hasOwnProperty('state');
}
export function hasQuantity(
  value?: any
): value is { quantity: number; name: string } {
  return !!value?.hasOwnProperty('quantity') && !!value?.hasOwnProperty('name');
}
// create a unique id the 4 is a fixed number in it
export function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
    return (
      // prettier-ignore
      ( // @ts-expect-error
        c ^
        // @ts-expect-error
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  });
}

// handle the dragging from the list items
export function checkItemOptionsOnDrag(ev: TIonDragEvent, triggerAmount = 160) {
  return ev.detail.amount > triggerAmount
    ? 'end'
    : ev.detail.amount < -triggerAmount
      ? 'start'
      : false;
}

export const matchesNameExactly = (item: IBaseItem, other: IBaseItem) =>
  item.name.toLowerCase() === other.name.toLowerCase();

export const matchesId = (item: IBaseItem, other: IBaseItem) =>
  item.id === other.id;

export function matchesItem<T extends IBaseItem>(item: T, others: T[]) {
  // by id first if not found try by name
  const byId = others.find((other) => matchesId(item, other));
  return byId || others.find((other) => matchesNameExactly(item, other));
}

export const matchesItemIdx = (item: IBaseItem, others: IBaseItem[]) => {
  const found = matchesItem(item, others);
  return others.findIndex((other) => other === found);
};

export const matchesSearchString = (value: string, searchQuery?: string) =>
  value
    .trim()
    .toLowerCase()
    .includes(searchQuery?.trim().toLowerCase() ?? '');

export const matchesSearch = (item: IBaseItem, searchQuery: string) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase());
export const matchesSearchExactly = (item: IBaseItem, searchQuery?: string) =>
  item.name.toLowerCase() === searchQuery?.toLowerCase();
export const matchesCategory = (item: IBaseItem, searchQuery: string) =>
  (item.category?.findIndex(
    (cat) => cat.toLowerCase().indexOf(searchQuery) >= 0
  ) ?? -1) >= 0;

export function parseNumberInput(ev: InputCustomEvent) {
  const value = ev.detail.value?.length ? ev.detail.value : '0';
  return Number.parseInt(value, 10);
}

export function validateDuplicateName<T extends IBaseItem>(
  items?: T[],
  item?: T
) {
  return (control: AbstractControl) => {
    const found = items?.filter((item) =>
      matchesSearchExactly(item, control.value)
    );
    if (!found || found.length === 0) return null;
    const hasDuplicates = found.length > 1 || found.pop()?.id !== item?.id;

    return hasDuplicates ? { duplicate: true } : null;
  };
}
