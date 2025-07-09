import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get(environment.urlhost + '/usuarios');
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${environment.urlhost + '/usuarios'}/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<any> {
    return this.http.get(`${environment.urlhost + '/usuarios'}/email/${email}`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(environment.urlhost + '/usuarios', usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${environment.urlhost + '/usuarios'}/${usuario.id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${environment.urlhost + '/usuarios'}/${id}`);
  }
}
