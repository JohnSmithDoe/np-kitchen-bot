import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
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
  imports: [IonSearchbar, TranslateModule],
})
export class ItemListSearchbarComponent implements OnInit {
  @ViewChild(IonSearchbar, { static: true }) ionSearchbar?: IonSearchbar;

  @Output() searchItem = new EventEmitter<string>();
  @Output() hitEnter = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {}

  searchTermChange(ev: SearchbarCustomEvent) {
    this.searchItem.emit(ev.detail.value ?? undefined);
  }

  clear() {
    if (!this.ionSearchbar) return;
    this.ionSearchbar.value = '';
  }
}
