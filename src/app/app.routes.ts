import { Routes } from '@angular/router';
import { PropiedadList } from './features/components/propiedades/propiedad-list/propiedad-list';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/components/propiedades/propiedad-list/propiedad-list').then(m => m.PropiedadList)
  }
];