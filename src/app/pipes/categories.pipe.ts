import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCategories',
  standalone: true,
})
export class CategoriesPipe implements PipeTransform {
  transform(value: string[] | undefined, altText?: string) {
    return !value ? altText ?? '' : value.join(', ');
  }
}
