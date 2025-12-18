import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="navbar" *ngIf="authService.isAuthenticated() && !isAuthRoute()">
        <div class="nav-brand">
          <h1> Stock Management</h1>
        </div>
        <ul class="nav-links">
          <li>
            <a routerLink="/articles" routerLinkActive="active">Articles</a>
          </li>
          <li *ngIf="authService.isAdmin()">
            <a routerLink="/clients" routerLinkActive="active">Clients</a>
          </li>
          <li>
            <a routerLink="/commandes" routerLinkActive="active">Commandes</a>
          </li>
          <li>
            <a routerLink="/livraisons" routerLinkActive="active">Livraisons</a>
          </li>
          <li *ngIf="authService.isAdmin()">
            <a routerLink="/personnel" routerLinkActive="active">Personnel</a>
          </li>
        </ul>
        <div class="user-info">
          <span class="user-name">{{ currentUser?.nom }} {{ currentUser?.prenom }}</span>
          <span class="user-role" [class.admin]="currentUser?.role === 'admin'">
            {{ currentUser?.role === 'admin' ? ' Admin' : ' Client' }}
          </span>
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h1 {
      font-size: 24px;
      padding: 15px 0;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 10px;
      flex: 1;
      justify-content: center;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      transition: all 0.3s;
      font-weight: 500;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.3);
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      font-weight: 500;
    }

    .user-role {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
    }

    .user-role.admin {
      background-color: #ffd700;
      color: #333;
    }

    .btn-logout {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  isAuthRoute(): boolean {
    const authRoutes = ['/login', '/register'];
    return authRoutes.includes(this.router.url);
  }

  title = 'Stock Management System';
  currentUser = this.authService.getCurrentUser();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

