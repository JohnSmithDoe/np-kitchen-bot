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
import { IBaseItem, TColor } from '../../@types/types';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-list-quickadd',
  templateUrl: 'item-list-quickadd.component.html',
  styleUrls: ['item-list-quickadd.component.scss'],
  standalone: true,
  imports: [BaseItemComponent, TranslateModule],
})
export class ItemListQuickaddComponent implements OnInit {
  @Input() quickAddLabel?: string;
  @Input() color?: TColor;

  @Input({ transform: booleanAttribute }) canQuickAdd = true;
  @Input({ transform: booleanAttribute }) canQuickAddGlobal = true;

  @Output() quickAddItem = new EventEmitter<void>();
  @Output() quickAddGlobal = new EventEmitter<IBaseItem>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  ngOnInit(): void {}
}
