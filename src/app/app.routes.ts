import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ModsPageComponent } from './mods-page/mods-page.component';
import { AboutPageComponent } from './about-page/about-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'mods', component: ModsPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
