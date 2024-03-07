import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { IBaseItem, TItemListCategory } from '../../@types/types';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
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
  readonly #database = inject(DatabaseService);

  @Input() item?: IBaseItem;
  @Input() categories: TItemListCategory[] = [];

  @Output() confirm = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter();

  items: TItemListCategory[] = [];
  allCategories: TItemListCategory[] = [];
  newCategories: TItemListCategory[] = [];
  selection: string[] = [];
  searchFor?: string;
  isExactlyIncluded = false;

  constructor() {}

  ngOnInit() {
    this.searchFor = undefined;
    this.allCategories = this.categories;
    if (this.item) {
      this.selection = this.item.category ?? [];
      this.selection
        .filter(
          (category) =>
            !this.allCategories.find((allCat) => allCat === category)
        )
        .forEach((name) => this.allCategories.push(name));
    }
    this.items = [...this.allCategories];
  }

  searchbarInput(ev: any) {
    this.searchFor = ev.target.value;
    if (!this.searchFor || !this.searchFor.length) {
      this.items = [...this.newCategories, ...this.allCategories];
      this.isExactlyIncluded = false;
    } else {
      this.items = [...this.newCategories, ...this.allCategories].filter(
        (cat) => cat.toLowerCase().includes(this.searchFor!.toLowerCase())
      );
      this.isExactlyIncluded = !!this.items.find(
        (item) => item.toLowerCase() === this.searchFor?.toLowerCase()
      );
    }
  }

  isChecked(item: TItemListCategory) {
    return this.selection.find((selected) => selected === item);
  }

  selectionChange(ev: any) {
    const { checked, value } = ev.detail;
    if (checked) {
      this.selection = [...this.selection, value.name];
    } else {
      this.selection = this.selection.filter((item) => item !== value.name);
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
