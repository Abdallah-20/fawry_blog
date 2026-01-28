import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: '', 
    component: LayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: 'posts', loadComponent: () => import('./features/post-list/post-list.component').then(m => m.PostListComponent) },
      { path: 'profile', loadComponent: () => import('./features/edit-profile/edit-profile.component').then(m => m.EditProfileComponent) },
      // Change this: Ensure the base path of the layout always goes to posts
      { path: '', redirectTo: 'posts', pathMatch: 'full' } 
    ]
  },
  // Ensure this is last
  { path: '**', redirectTo: 'login' }
];

// export const routes: Routes = [
//   { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
//   { path: 'register', loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },
//   { 
//     path: '', 
//     component: LayoutComponent, // The navbar will show here
//     canActivate: [authGuard],
//     children: [
//       { path: 'posts', loadComponent: () => import('./features/post-list/post-list.component').then(m => m.PostListComponent) },
//       { path: '', redirectTo: 'posts', pathMatch: 'full' }
//     ]
//   },
//   { path: '**', redirectTo: 'login' }
// ];