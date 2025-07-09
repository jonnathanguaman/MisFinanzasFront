import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  constructor(private http: HttpClient) {}


  getTransaccionesDelUsuario(username:string): Observable<any> {
    return this.http.get(`${environment.urlhost + '/transacciones/transuser'}/${username}`);
  }

  getTransacciones(): Observable<any> {
    return this.http.get(environment.urlhost + '/transacciones');
  }

  createTransaccion(data: any): Observable<any> {
    return this.http.post(environment.urlhost + '/transacciones', data);
  }

  updateTransaccion(data: any): Observable<any> {
    return this.http.put(`${environment.urlhost + '/transacciones'}/${data.id}`, data);
  }

  deleteTransaccion(id: number): Observable<any> {
    return this.http.delete(`${environment.urlhost + '/transacciones'}/${id}`);
  }

  getBalanceUsuario(id: number): Observable<any> {
    return this.http.get(`${environment.urlhost + '/transacciones'}/usuario/${id}/balance`);
  }
}
