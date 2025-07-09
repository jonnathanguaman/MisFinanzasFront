import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRegister } from '../../Services/authRegister/auth-register';
import { UsuarioService } from '../../Services/usuario/usuario';
import { authRegister } from '../../Services/authRegister/auth_interface';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login/login';
import { LoginRequest } from '../../Services/login/LoginRequest';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  usuarioForm: FormGroup;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthRegister,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  registrar() {

    if (this.usuarioForm.invalid || this.authForm.invalid) {
      alert('Por favor completa todos los campos');
      return;
    }

    const username = this.authForm.value.username;

    this.authService.getIdUser(username).subscribe({
      next: (res) => {
        if(res){
          return alert('El usuario ya existe, por favor elige otro nombre de usuario');
        }
       
        const usuario: UsuarioInterface = this.usuarioForm.value;

        this.usuarioService.createUsuario(usuario).subscribe({
          next: (res) => {
            const usuarioId = res.data.id; 
            const auth: authRegister = {
              username: this.authForm.value.username,
              password: this.authForm.value.password,
              usuarioId: usuarioId,
            };

            this.authService.registerAuth(auth).subscribe({
              next: (res) => {
                alert('Usuario registrado exitosamente');
                this.loginService.login(this.authForm.value as unknown as LoginRequest).subscribe({
                  next:(data)=>{
                    this.usuarioForm.reset();
                    this.authForm.reset();
                    this.router.navigateByUrl("/finanzas/dashboard")
                  },
                  error:()=>{
                    alert("Usuario o contraseña incorrectos");
                  },
                })
              },
              error: (err) => alert('Error al registrar credenciales: ' + err.error.message)
            });
          },
          error: (err) => alert('Error al registrar usuario: ' + err.error.message)
        });
      },
    })
  }

}
