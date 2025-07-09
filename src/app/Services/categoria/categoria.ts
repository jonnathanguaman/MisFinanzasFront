import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServices {

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any> {
    return this.http.get(environment.urlhost + '/categorias');
  }

  getCategoriasByUsuario(username:string): Observable<any> {
    return this.http.get(`${environment.urlhost + '/categorias/catsuser'}/${username}`);
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post(environment.urlhost + '/categorias', categoria);
  }

  updateCategoria(categoria: any): Observable<any> {
    return this.http.put(`${environment.urlhost + '/categorias'}/${categoria.id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${environment.urlhost + '/categorias'}/${id}`);
  }
}
