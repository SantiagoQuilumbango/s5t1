// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';

const routes: Routes = [
  {
    path: '', //url
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./proveedores/proveedores.component').then((m) => m.ProveedoresComponent)
      },
      {
        path: 'nuevoproveedor',
        loadComponent: () => import('./proveedores/nuevoproveedor/nuevoproveedor.component').then((m) => m.NuevoproveedorComponent)
      },
      {
        path: 'editarproveedor/:id',
        loadComponent: () => import('./proveedores/nuevoproveedor/nuevoproveedor.component').then((m) => m.NuevoproveedorComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./clientes/clientes.component').then((m) => m.ClientesComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}