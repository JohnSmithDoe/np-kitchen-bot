import { Component, inject, OnInit } from '@angular/core';
import { ActionSheetButton } from '@ionic/angular';
import { IonActionSheet } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { IAppState } from '../../@types/types';
import { ShoppingActions } from '../../state/shopping/shopping.actions';
import { selectShoppingListHasBoughtItems } from '../../state/shopping/shopping.selector';

const moveToShoppingListButton: ActionSheetButton = {
  text: 'In die Lagerliste übertragen',
  role: 'destructive',
  data: {
    action: 'move',
  },
};

const shareButton: ActionSheetButton = {
  text: 'Share',
  data: {
    action: 'share',
  },
};

const cancelButton: ActionSheetButton = {
  text: 'Abbrechen',
  role: 'cancel',
  data: {
    action: 'cancel',
  },
};

@Component({
  selector: 'app-shopping-action-sheet',
  standalone: true,
  templateUrl: './shopping-action-sheet.component.html',
  styleUrls: ['./shopping-action-sheet.component.scss'],
  imports: [IonActionSheet],
})
export class ShoppingActionSheetComponent implements OnInit {
  readonly #store = inject(Store<IAppState>);
  readonly translate = inject(TranslateService);

  public actionSheetButtons: ActionSheetButton[] = [];

  triggerAction(ev: CustomEvent<{ data?: { action: string }; role?: string }>) {
    if (ev.detail.data?.action === 'share') {
      this.#store.dispatch(ShoppingActions.shareShoppinglist());
    } else if (ev.detail.data?.action === 'move') {
      this.#store.dispatch(ShoppingActions.moveToStorage());
    }
  }

  ngOnInit(): void {
    this.#store
      .select(selectShoppingListHasBoughtItems)
      .subscribe((hasBoughtItems) => {
        if (hasBoughtItems) {
          this.actionSheetButtons = [
            moveToShoppingListButton,
            shareButton,
            cancelButton,
          ];
        } else {
          this.actionSheetButtons = [shareButton, cancelButton];
        }
      });
  }
}
