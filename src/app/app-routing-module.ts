import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Categoria } from './Pages/platilla-user/categoria/categoria';
import { Usuario } from './Pages/platilla-user/usuario/usuario';
import { Transacciones } from './Pages/platilla-user/transacciones/transacciones';
import { Dashboard } from './Pages/platilla-user/dashboard/dashboard';
import { PlatillaUser } from './Pages/platilla-user/platilla-user';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  { 
    path: 'registro', 
    component: Register 
  },
  {
    path: 'finanzas',
    component:PlatillaUser,
    children: [
      {
        path: 'categoria',
        component:Categoria
      },
      {
        path: 'usuario',
        component:Usuario
      },
      {
        path: 'transacciones',
        component:Transacciones
      },
      {
        path: 'dashboard',
        component:Dashboard
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
