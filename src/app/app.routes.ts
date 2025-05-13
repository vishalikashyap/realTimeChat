import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth/login',
        loadComponent: () =>
          import('../app/auth/login/login').then(m => m.Login),
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('../app/auth/sign-up/sign-up').then(m => m.SignUp),
      },

      {
        path: 'overview/dashboard',
        loadComponent: () =>
          import('../app/component/dashboard/dashboard').then(m => m.Dashboard),
        children: [
          {
            path: 'chat',
            loadComponent: () =>
              import('../app/chat/chat').then(m => m.Chat),
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('../app/component/notifications/notifications').then(m => m.Notifications),
          },
          {
            path: 'user',
            loadComponent: () =>
              import('../app/component/profile/profile').then(m => m.Profile),
          }
        ]
      },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];
