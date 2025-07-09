import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../Enviroment/enviroment';
import { LoginRequest } from './LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor(
    private http:HttpClient,
    private router:Router, 
    ) {
    if (typeof window !== 'undefined' && sessionStorage) {
      this.currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
      this.currentUserData = new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
      
    } else {
      this.currentUserLoginOn = new BehaviorSubject<boolean>(false);
      this.currentUserData = new BehaviorSubject<String>("");
    }  
  }

  login(credentials:LoginRequest):Observable<any>{
    return this.http.post<any>(environment.urlhost+"/login",credentials).pipe(
      tap((userData) => {
        sessionStorage.setItem("token",userData.token)
        this.currentUserData.next(userData.token)
        this.currentUserLoginOn.next(true)
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    )
  }

  logOut():void{
    sessionStorage.removeItem("token");
    this.currentUserLoginOn.next(false)
    this.router.navigateByUrl("/login")

  }

  get userDate():Observable<String>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn():Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
      return this.currentUserData.value
  }

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.log('Se ha produciodo un error ' + error)
    }else{
      console.log('El backend retorno el codigo del error ' + error)
    }
    return throwError(() => new Error('Algo falló, Por fvor intente de nuevo'))
  }
}
