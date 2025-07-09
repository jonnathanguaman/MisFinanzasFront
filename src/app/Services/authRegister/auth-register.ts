import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';
import { authRegister } from './auth_interface';

@Injectable({
  providedIn: 'root'
})
export class AuthRegister {

  constructor(private http: HttpClient) {}

  registerAuth(auth: authRegister): Observable<any> {
    return this.http.post<any>(environment.urlhost + '/auth/', auth);
  }

  getAuth(nombre: String): Observable<any> {
    return this.http.get<any>(
      `${environment.urlhost + '/auth/'}/${nombre}`
    );
  }

  getIdPerson(nombre: String): Observable<any> {
    return this.http.get<any>(
      `${environment.urlhost + '/auth'}/${nombre}`
    );
  }

  getAuthById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.urlhost + '/v1/auth'}/${id}`
    );
  }

  getIdUser(username: string): Observable<any> {
    return this.http.get<any>(
      `${environment.urlhost + '/auth/getIdUser'}/${username}`
    );
  }

}
