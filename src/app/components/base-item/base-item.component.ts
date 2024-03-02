import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
} from '@ionic/angular/standalone';
import { IBaseItem, TColor } from '../../@types/types';
import { createBaseItem } from '../../app.factory';
import { CategoriesPipe } from '../../pipes/categories.pipe';

@Component({
  selector: 'app-base-item',
  standalone: true,
  templateUrl: './base-item.component.html',
  styleUrls: ['./base-item.component.scss'],
  imports: [CategoriesPipe, IonItem, IonLabel, IonListHeader, IonNote],
})
export class BaseItemComponent implements OnInit {
  @Input() header?: string;
  @Input() headerColor?: TColor;

  @Input() label?: string | null;
  @Input() color?: TColor;
  @Input() category?: string;
  @Input() helper?: string;

  @Output() selectItem = new EventEmitter<IBaseItem>();

  constructor() {}

  ngOnInit() {}

  selectCurrent() {
    if (!this.label?.length) return;
    this.selectItem.emit(createBaseItem(this.label, this.category));
  }
}
