import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';

@Component({
  selector: 'app-item-list-empty',
  templateUrl: 'item-list-empty.component.html',
  styleUrls: ['item-list-empty.component.scss'],
  standalone: true,
  imports: [TextItemComponent, TranslateModule],
})
export class ItemListEmptyComponent implements OnInit {
  @Input({ transform: booleanAttribute }) isEmptyList = true;
  @Input({ transform: booleanAttribute }) isSearching = false;
  @Input() searchTerm?: string;

  @Output() emptyItem = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {}
}