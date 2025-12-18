import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'articles',
    loadComponent: () => import('./components/articles/article-list/article-list.component').then(m => m.ArticleListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./components/clients/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'commandes',
    loadComponent: () => import('./components/commandes/commande-list/commande-list.component').then(m => m.CommandeListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'livraisons',
    loadComponent: () => import('./components/livraisons/livraison-list/livraison-list.component').then(m => m.LivraisonListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'personnel',
    loadComponent: () => import('./components/personnel/personnel-list/personnel-list.component').then(m => m.PersonnelListComponent),
    canActivate: [adminGuard]
  }
];
