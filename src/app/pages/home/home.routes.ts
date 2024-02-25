import {Routes} from '@angular/router';
import {HomePage} from "./home.page";

const redirectToStartPage = '/home/database';
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
        path: 'database',
        loadComponent: () =>
          import('../database/database.page').then((m) => m.DatabasePage),
      },
      {
        path: '',
        redirectTo: redirectToStartPage,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: redirectToStartPage,
    pathMatch: 'full',
  },
];
