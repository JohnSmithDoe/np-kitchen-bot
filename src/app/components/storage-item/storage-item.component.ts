import {NgTemplateOutlet} from "@angular/common";
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
  IonReorder
} from "@ionic/angular/standalone";
import {Color} from '@ionic/core/dist/types/interface'
import {TranslateModule} from "@ngx-translate/core";
import {StorageItem} from "../../@types/types";
import {CategoriesPipe} from "../../pipes/categories.pipe";
import {uuidv4} from "../../utils";

@Component({
  selector: 'app-storage-item',
  standalone: true,
  templateUrl: './storage-item.component.html',
  styleUrls: ['./storage-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonReorder,
    TranslateModule,
    NgTemplateOutlet,
    IonNote,
    IonListHeader,
    CategoriesPipe
  ]
})
export class StorageItemComponent  implements OnInit {
  @Input() item!: StorageItem;
  @Input() header?: string;
  @Input() label?: string;
  @Input() type: 'simple' | 'extended' = 'simple';
  @Input() color: Color = 'primary';
  @Input() helper?: string = 'Click here to add...';

  @Output() selectItem = new EventEmitter<StorageItem>();
  @Output() cartItem = new EventEmitter<StorageItem>();

  constructor() { }

  ngOnInit() {
    if(!this.item && !this.label) throw new Error('Either label or item must be set');
    if(!this.item && this.label) {
      this.item = { name: this.label, id: uuidv4(), quantity: 1};
    }
  }

}
