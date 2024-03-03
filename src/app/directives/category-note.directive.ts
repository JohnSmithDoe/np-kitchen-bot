import { Directive, ElementRef, inject, Input } from '@angular/core';
import { IBaseItem } from '../@types/types';

@Directive({
  selector: '[appCategoryNote]',
  standalone: true,
})
export class CategoryNoteDirective {
  readonly #element = inject(ElementRef<HTMLIonNoteElement>);
  // readonly #translate = inject(TranslateService);

  @Input()
  set appCategoryNote(val: IBaseItem | undefined) {
    if (val?.category?.length) {
      this.#element.nativeElement.style.display = 'block';
      this.#element.nativeElement.innerText = val.category.join(', ');
    } else {
      this.#element.nativeElement.style.display = 'none';
      // this.#element.nativeElement.innerText =
      //   this.#translate.instant('list-header.base');
    }
  }
}
