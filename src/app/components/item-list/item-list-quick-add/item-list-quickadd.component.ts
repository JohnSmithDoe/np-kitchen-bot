import {
  booleanAttribute,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { TColor } from '../../../@types/types';
import { DatabaseService } from '../../../services/database.service';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';

@Component({
  selector: 'app-item-list-quickadd',
  templateUrl: 'item-list-quickadd.component.html',
  styleUrls: ['item-list-quickadd.component.scss'],
  standalone: true,
  imports: [TextItemComponent, TranslateModule],
})
export class ItemListQuickaddComponent implements OnDestroy, OnChanges {
  readonly #database = inject(DatabaseService);

  @Input() quickAddLabel?: string;
  @Input() listName?: string;
  @Input() color?: TColor;

  @Output() quickAddItem = new EventEmitter<void>();
  @Output() quickCreateGlobal = new EventEmitter<void>();

  @Input({ transform: booleanAttribute }) showQuickAdd = true;
  canQuickAdd = true;
  @Input({ transform: booleanAttribute }) showQuickAddGlobal = true;
  canQuickAddGlobal = true;

  #settingsChangedSub?: Subscription;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  // ngOnInit(): void {
  // this.#settingsChangedSub = this.#database.save$.subscribe(() => {
  //   this.canQuickAdd = this.#database.settings.showQuickAdd;
  //   this.canQuickAddGlobal = this.#database.settings.showQuickAddGlobal;
  // });
  // }

  ngOnDestroy(): void {
    this.#settingsChangedSub?.unsubscribe();
  }
}
