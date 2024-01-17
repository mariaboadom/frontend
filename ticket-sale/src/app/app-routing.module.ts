import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VentaEntradasComponent } from './venta-entradas/venta-entradas.component';
import { AgradecimientoComponent } from './agradecimiento/agradecimiento.component';
import { ErrorComponent } from './error/error.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para la página de inicio
  { path: 'admin', component: AdminComponent }, // Ruta para la página de venta de entradas
  { path: 'venta-entradas', component: VentaEntradasComponent }, // Ruta para la página de venta de entradas
  { path: 'agradecimiento', component: AgradecimientoComponent }, // Ruta para la página de agradecimiento
  { path: 'error', component: ErrorComponent }, // Ruta para la página de agradecimiento
  { path: '**', redirectTo: '' }, // Redireccionar a la página de inicio si la URL es incorrecta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

