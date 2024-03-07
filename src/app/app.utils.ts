import { TIonDragEvent } from './@types/types';

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
