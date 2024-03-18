import { Routes } from '@angular/router';
import { HomePage } from './home.page';

const redirectToStartPage = '/home/storage';
export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'shopping/:listId',
        loadComponent: () =>
          import('../shopping/shopping.page').then((m) => m.ShoppingPage),
      },
      {
        path: 'storage',
        loadComponent: () =>
          import('../storage/storage.page').then((m) => m.StoragePage),
      },
      {
        path: 'database',
        loadComponent: () =>
          import('../globals/globals.page').then((m) => m.GlobalsPage),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('../tasks/tasks.page').then((m) => m.TasksPage),
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
