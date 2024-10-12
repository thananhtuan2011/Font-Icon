import { Routes } from '@angular/router';
import { HomeComponent } from './_page/home/home.component';
import { IconsComponent } from './_page/icons-page/icons.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'icons',
        component: IconsComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
