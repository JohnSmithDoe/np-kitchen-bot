import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonActionSheet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-common-actions-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonActionSheet],
  templateUrl: './common-actions-sheet.component.html',
  styleUrl: './common-actions-sheet.component.scss',
})
export class CommonActionsSheetComponent {
  @Input() trigger?: string;
  actionSheetButtons = [
    {
      text: 'Used Item',
      data: {
        action: 'used',
      },
    },
    {
      text: 'Unpack Shopping',
      data: {
        action: 'shopping',
      },
    },
    {
      text: 'Cooked Recipe',
      data: {
        action: 'cooking',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
}
