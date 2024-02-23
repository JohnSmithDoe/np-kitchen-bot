import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'appCategories',
  standalone: true
})
export class CategoriesPipe implements PipeTransform {
 readonly translate = inject(TranslateService);

 transform(value: string[]|undefined): string {
    if(!value) return this.translate.instant('storage-item.no-category')
    return value.join(', ');
  }

}
