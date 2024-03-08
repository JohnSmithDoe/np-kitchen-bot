import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxCustomEvent } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TItemListCategory } from '../../@types/types';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonCheckbox,
    FormsModule,
    TranslateModule,
    IonLabel,
    IonNote,
  ],
})
export class CategoriesDialogComponent implements OnInit {
  // TODO could be done by a category dialog component state
  @Input() categories: TItemListCategory[] = [];
  @Input() itemCategories?: TItemListCategory[];

  @Output() confirm = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter();

  items: TItemListCategory[] = [];
  newCategories: TItemListCategory[] = [];
  selection: string[] = [];
  searchFor?: string;
  isExactlyIncluded = false;

  constructor() {}

  ngOnInit() {
    this.searchFor = undefined;
    this.selection = this.itemCategories ?? [];

    this.items = [...new Set([...this.categories, ...this.selection])];
  }

  searchbarInput(ev: any) {
    this.searchFor = ev.target.value;
    if (!this.searchFor || !this.searchFor.length) {
      this.items = [...this.newCategories, ...this.categories];
      this.isExactlyIncluded = false;
    } else {
      this.items = [...this.newCategories, ...this.categories].filter((cat) =>
        cat.toLowerCase().includes(this.searchFor!.toLowerCase())
      );
      this.isExactlyIncluded = !!this.items.find(
        (item) => item.toLowerCase() === this.searchFor?.toLowerCase()
      );
    }
  }

  isChecked(item: TItemListCategory) {
    return this.selection.find((selected) => selected === item);
  }

  selectionChange(ev: CheckboxCustomEvent<TItemListCategory>) {
    const { checked, value } = ev.detail;
    if (checked) {
      this.selection = [...this.selection, value];
    } else {
      this.selection = this.selection.filter((item) => item !== value);
    }
  }

  addNewCategory() {
    if (this.searchFor && !!this.searchFor.length) {
      this.newCategories.push(this.searchFor);
      this.selection = [...this.selection, this.searchFor];
      this.searchbarInput({ target: { value: null } });
    }
  }
}
