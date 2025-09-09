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

    createDeuda(data: PagosPendientesInterface): Observable<PagosPendientesInterface> {
      return this.http.post<PagosPendientesInterface>(environment.urlhost + '/deuda', data);
    }

    actualizarDeuda(data: PagosPendientesInterface, id:number): Observable<PagosPendientesInterface> {
      return this.http.put<PagosPendientesInterface>(`${environment.urlhost + '/deuda'}/${id}`,data);
    }

    eliminarDeuda(id:number): Observable<void> {
      return this.http.delete<void>(`${environment.urlhost + '/deuda'}/${id}`);
    }
}
