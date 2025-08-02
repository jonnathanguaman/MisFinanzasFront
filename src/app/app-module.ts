import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Categoria } from './Pages/platilla-user/categoria/categoria';
import { Usuario } from './Pages/platilla-user/usuario/usuario';
import { Transacciones } from './Pages/platilla-user/transacciones/transacciones';
import { Dashboard } from './Pages/platilla-user/dashboard/dashboard';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MenuAdmin } from './Shared/menu-admin/menu-admin';
import { PlatillaUser } from './Pages/platilla-user/platilla-user';
import { JwtInterceptorService } from './Services/jwt-interceptor-service';
import { MenuUser } from './Shared/menu-user/menu-user';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { PagosPendientes } from './Pages/platilla-user/pagos-pendientes/pagos-pendientes';

@NgModule({
  declarations: [
    App,
    Categoria,
    Usuario,
    Transacciones,
    Dashboard,
    MenuUser,
    MenuAdmin,
    PlatillaUser,
    Login,
    Register,
    PagosPendientes
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
