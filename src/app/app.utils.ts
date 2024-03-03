import {
  IBaseItem,
  IItemCategory,
  IItemList,
  IShoppingItem,
  IStorageItem,
  TIonDragEvent,
} from './@types/types';

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
//TODO clean up
export function getCategoryItemsFromList(
  category: IItemCategory | undefined,
  itemList: IItemList<IStorageItem>
) {
  if (!category) return itemList.items;
  return category.items
    .map((base) => itemList.items.find((item) => base.id === item.id))
    .filter((item) => !!item) as IStorageItem[];
}
export function getCategoryItemsFromListShopping(
  category: IItemCategory | undefined,
  itemList: IItemList<IShoppingItem>
) {
  if (!category) return itemList.items;
  return category.items
    .map((base) => itemList.items.find((item) => base.id === item.id))
    .filter((item) => !!item) as IShoppingItem[];
}
export function getCategoryItemsFromListShoppingBsse(
  category: IItemCategory | undefined,
  itemList: IItemList
) {
  if (!category) return itemList.items;
  return category.items
    .map((base) => itemList.items.find((item) => base.id === item.id))
    .filter((item) => !!item) as IBaseItem[];
}
// grouping items by category
// creates a new IItemCategory array from the given list
export function getCategoriesFromList(...itemList: (IItemList | undefined)[]) {
  const allItems = itemList.reduce((all, cur) => {
    cur?.items.forEach((item) => {
      if (!all.includes(item)) {
        all.push(item);
      }
    });
    return all;
  }, [] as IBaseItem[]);
  return allItems.reduce((categories, item) => {
    item.category?.forEach((category) => {
      // hmm: string category on item
      const found = categories.find((cat) => cat.name === category);
      if (!found) {
        categories.push({ name: category, items: [item] });
      } else {
        found.items.push(item);
      }
    });
    return categories;
  }, [] as IItemCategory[]);
}

// handle the dragging from the list items
export function checkItemOptionsOnDrag(ev: TIonDragEvent, triggerAmount = 160) {
  return ev.detail.amount > triggerAmount
    ? 'end'
    : ev.detail.amount < -triggerAmount
      ? 'start'
      : false;
}
