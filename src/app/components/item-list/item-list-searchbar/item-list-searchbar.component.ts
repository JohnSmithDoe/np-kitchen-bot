import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular';
import { IonSearchbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';

@Component({
  selector: 'app-item-list-searchbar',
  templateUrl: 'item-list-searchbar.component.html',
  styleUrls: ['item-list-searchbar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonSearchbar, TranslateModule],
})
export class ItemListSearchbarComponent {
  @Input() query?: string;

  @Output() queryChange = new EventEmitter<string>();
  @Output() hitEnter = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  searchTermChange(ev: SearchbarCustomEvent) {
    this.queryChange.emit(ev.detail.value ?? undefined);
  }
}
