import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import {
  selectQuickAddCanAddCategory,
  selectQuickAddCanAddGlobal,
  selectQuickAddCanAddLocal,
  selectQuickAddState,
} from '../../../state/quick-add/quick-add.selector';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';

@Component({
  selector: 'app-item-list-quickadd',
  templateUrl: 'item-list-quickadd.component.html',
  styleUrls: ['item-list-quickadd.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextItemComponent, TranslateModule, AsyncPipe],
})
export class ItemListQuickaddComponent {
  readonly #store = inject(Store);
  rxState$ = this.#store.select(selectQuickAddState);
  rxShowLocal$ = this.#store.select(selectQuickAddCanAddLocal);
  rxShowGlobal$ = this.#store.select(selectQuickAddCanAddGlobal);
  rxShowCategoy$ = this.#store.select(selectQuickAddCanAddCategory);

  @Output() quickAddItem = new EventEmitter<void>();
  @Output() quickCreateGlobal = new EventEmitter<void>();
  @Output() quickCreateCategory = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }
}
