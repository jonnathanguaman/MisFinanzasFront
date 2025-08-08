import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PagosPendientesService {

  constructor(private http: HttpClient) { }

   getTransaccionesDelUsuario(username:string): Observable<any> {
      return this.http.get(`${environment.urlhost + '/deuda/deudaUser'}/${username}`);
    }

    createDeuda(data: any): Observable<any> {
      return this.http.post(environment.urlhost + '/deuda', data);
    }
}
