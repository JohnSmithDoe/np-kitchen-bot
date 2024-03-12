import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  IBaseItem,
  IGlobalItem,
  ISearchResult,
  IShoppingItem,
  IStorageItem,
} from '../../../@types/types';
import { CategoriesPipe } from '../../../pipes/categories.pipe';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';
import { ItemListComponent } from '../item-list.component';

@Component({
  selector: 'app-item-list-search-result',
  standalone: true,
  templateUrl: './item-list-search-result.component.html',
  styleUrls: ['./item-list-search-result.component.scss'],
  imports: [
    ItemListComponent,
    TextItemComponent,
    CategoriesPipe,
    TranslateModule,
  ],
})
export class ItemListSearchResultComponent<T extends IBaseItem> {
  @Input() results?: ISearchResult<T> | null;

  selectGlobalItem(item: IGlobalItem) {}
  selectShoppingItem(item: IShoppingItem) {}
  selectStorageItem(item: IStorageItem) {}
}
