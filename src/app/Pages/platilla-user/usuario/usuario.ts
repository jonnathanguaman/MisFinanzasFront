import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../Services/usuario/usuario';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class Usuario {

  usuarioForm: FormGroup;
  usuarios: UsuarioInterface[] = [];
  usuarioEditandoId?: number;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get nombre() {
    return this.usuarioForm.get('nombre')!;
  }

  get email() {
    return this.usuarioForm.get('email')!;
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => this.usuarios = res.data,
      error: (err) => alert('Error al cargar usuarios: ' + err.message)
    });
  }

  guardarUsuario(): void {
    const usuario: UsuarioInterface = this.usuarioForm.value;

    if (this.usuarioEditandoId) {
      usuario.id = this.usuarioEditandoId;
      this.usuarioService.updateUsuario(usuario).subscribe({
        next: (res) => {
          alert(res.message);
          this.resetForm();
          this.cargarUsuarios();
        },
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.usuarioService.createUsuario(usuario).subscribe({
        next: (res) => {
          alert(res.message);
          this.resetForm();
          this.cargarUsuarios();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editarUsuario(usuario: UsuarioInterface): void {
    this.usuarioEditandoId = usuario.id;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: (res) => {
          alert(res.message);
          this.cargarUsuarios();
        },
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  buscarPorId(id: number): void {
    if (!id) return alert('Ingrese un ID');
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (res) => {
        const u = res.data;
        alert(`Usuario: ${u.nombre} | Email: ${u.email}`);
      },
      error: () => alert('No se encontró el usuario.')
    });
  }

  buscarPorEmail(email: string): void {
    if (!email) return alert('Ingrese un email');
    this.usuarioService.getUsuarioByEmail(email).subscribe({
      next: (res) => {
        const u = res.data;
        alert(`Usuario: ${u.nombre} | Email: ${u.email}`);
      },
      error: () => alert('No se encontró el usuario.')
    });
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.usuarioEditandoId = undefined;
  }

}
