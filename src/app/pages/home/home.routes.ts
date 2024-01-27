import {Routes} from '@angular/router';
import {HomePage} from "./home.page";

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'shoppinglist',
        loadComponent: () =>
          import('../shoppinglist/shoppinglist.page').then((m) => m.ShoppinglistPage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/home/shoppinglist',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/shoppinglist',
    pathMatch: 'full',
  },
];
