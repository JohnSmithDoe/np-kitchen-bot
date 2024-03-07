import { Routes } from '@angular/router';
import { HomePage } from './home.page';

const redirectToStartPage = '/home/storage';
export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'shoppinglist',
        loadComponent: () =>
          import('../shoppinglist/shoppinglist.page').then(
            (m) => m.ShoppinglistPage
          ),
      },
      {
        path: 'storage',
        loadComponent: () =>
          import('../storage/storage.page').then((m) => m.StoragePage),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tasks/tasks.page').then((m) => m.TasksPage),
      },
      {
        path: 'database',
        loadComponent: () =>
          import('../globals/globals.page').then((m) => m.GlobalsPage),
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
