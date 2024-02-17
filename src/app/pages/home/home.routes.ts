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
        path: 'inventory',
        loadComponent: () =>
          import('../inventory/inventory.page').then((m) => m.InventoryPage),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tasks/tasks.page').then((m) => m.TasksPage),
      },
      {
        path: '',
        redirectTo: '/home/inventory',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/inventory',
    pathMatch: 'full',
  },
];
