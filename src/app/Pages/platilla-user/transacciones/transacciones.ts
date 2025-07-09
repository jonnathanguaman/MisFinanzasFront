import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransaccionesService } from '../../../Services/transacciones/transacciones';
import { TokenPayload } from '../../../Services/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { AuthRegister } from '../../../Services/authRegister/auth-register';
import { CategoriaServices } from '../../../Services/categoria/categoria';

@Component({
  selector: 'app-transacciones',
  standalone: false,
  templateUrl: './transacciones.html',
  styleUrl: './transacciones.css'
})
export class Transacciones {
  @ViewChild('closeBtn', { static: false }) closeBtn!: ElementRef;

  transaccionForm: FormGroup;
  transacciones: any[] = [];
  categorias: CategoriaInterface[] = [];
  balanceUsuario: string = '';

  constructor(
    private fb: FormBuilder,
    private transaccionService: TransaccionesService,
    private authservice: AuthRegister,
    private categoriaService: CategoriaServices,
  ) {
    this.transaccionForm = this.fb.group({
      id: [null],
      monto: [0, [Validators.required, Validators.min(0.01)]],
      tipo: ['', Validators.required],
      descripcion: [''],
      fechaTransaccion: ['', Validators.required],
      usuarioId: [null],
      categoriaId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
     if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        this.categoriaService.getCategoriasByUsuario(payload.sub).subscribe({
              next: (res) => {
                this.categorias = res.data;
                this.cargarTransacciones();
                console.log("Categorías obtenidas dentro:", this.categorias);  
              }
            });
      } catch (error) {
        console.error('Error decoding token:', error);
        return alert("Hemos tenido un problema");
      }
    }
    
  }

  cargarTransacciones(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token)
        
        this.transaccionService.getTransaccionesDelUsuario(payload.sub).subscribe({
          next: (res) => this.transacciones = res.data,
          error: (err) => alert("Error al cargar: " + err.message)
        });

      } 
      catch (error) {
          return alert("Hemos tenido un problema");
      }
    }
  }

  guardarTransaccion(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        

        this.authservice.getIdUser(payload.sub).subscribe({
          next: (res) => {
            const usuarioId = res;

            this.transaccionForm.patchValue({ usuarioId });
            const transaccion = this.transaccionForm.value;
            console.log(transaccion);
            
            const request = transaccion.id
              ? this.transaccionService.updateTransaccion(transaccion)
              : this.transaccionService.createTransaccion(transaccion);

            request.subscribe({
              next: (res) => {
                alert(res.message);
                this.resetForm();
                this.cargarTransacciones();
                this.closeBtn.nativeElement.click();
              },
              error: (err) => alert("Error al guardar: " + err.message)
            });
          }
        })
      }catch (error) {
        console.error('Error decoding token:', error);
        return alert("Hemos tenido un problema");
      }
    }
  }

  editarTransaccion(t: any): void {
    this.transaccionForm.patchValue({
      ...t,
      fechaTransaccion: t.fechaTransaccion.slice(0, 16)
    });
  }

  eliminarTransaccion(id: number): void {
    if (confirm("¿Eliminar esta transacción?")) {
      this.transaccionService.deleteTransaccion(id).subscribe({
        next: (res) => {
          alert(res.message);
          this.cargarTransacciones();
        },
        error: (err) => alert("Error al eliminar: " + err.message)
      });
    }
  }

  consultarBalance(id: number): void {
    if (!id) return alert("Ingrese un ID de usuario");

    this.transaccionService.getBalanceUsuario(id).subscribe({
      next: (res) => {
        const b = res.data;
        this.balanceUsuario = `Usuario: ${b.nombreUsuario} | Ingresos: $${b.totalIngresos} | Egresos: $${b.totalEgresos} | Balance: $${b.balance}`;
      },
      error: (err) => alert("Error al consultar balance: " + err.message)
    });
  }

  resetForm(): void {
    this.transaccionForm.reset();
  }

}
