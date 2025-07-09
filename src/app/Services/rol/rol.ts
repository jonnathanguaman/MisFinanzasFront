import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from './rol_Interface';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }
  
    getRoles(): Observable<Rol[]> {
      return this.http.get<Rol[]>(environment.urlhost + "/rol");
    }

    getRoleParaAsociado(): Observable<Rol[]> {
      return this.http.get<Rol[]>(environment.urlhost + "/rolParaAsociado");
    }
}
