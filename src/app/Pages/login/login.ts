import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login/login';
import { LoginRequest } from '../../Services/login/LoginRequest';
import { environment } from '../../../Enviroment/enviroment';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  login(){
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value as unknown as LoginRequest).subscribe({
        next:(data)=>{
          this.router.navigateByUrl("/finanzas/dashboard")
        },
        error:()=>{
          alert("Usuario o contraseña incorrectos");
        },
      })
    }
    else{
      this.loginForm.markAllAsTouched();
      alert
    }
  }


}
