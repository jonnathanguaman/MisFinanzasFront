import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PagosPendientesService } from '../../../Services/pagosPendientes/pagos-pendientes';
import { TokenPayload } from '../../../Services/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRegister } from '../../../Services/authRegister/auth-register';

declare var bootstrap: any;

@Component({
  selector: 'app-pagos-pendientes',
  standalone: false,
  templateUrl: './pagos-pendientes.html',
  styleUrl: './pagos-pendientes.css'
})

export class PagosPendientes implements OnInit {
  @ViewChild('modalEditar') modalEditar!: ElementRef;

  pagosPendientesForm: FormGroup;

  pagpsPendientes: PagosPendientesInterface[] = [];

  constructor(private pagosPendientesService:PagosPendientesService,
    private fb: FormBuilder,
    private authservice: AuthRegister,
  ) {
    this.pagosPendientesForm = this.fb.group({
      id:[, Validators.required],
      nombre: [, Validators.required],
      monto:[, Validators.required],
      descripcion: [, Validators.required],
      tipo: [, Validators.required],
      meses: [, Validators.required],
      fechaVencimiento: [, Validators.required],
      idUsuario: [, Validators.required],
      estado: [, Validators.required],
    });
  }

  abrirModal() {
    this.pagosPendientesForm.reset();
    const modalElement = document.getElementById('transaccionModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }



  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        this.pagosPendientesService.getTransaccionesDelUsuario(payload.sub).subscribe(
          {
            next: (data) => {
              this.pagpsPendientes = data.data;
              },
              error: (error) => {
              console.error('Error al obtener transacciones:', error);
            } 
          }
        );
      }
      catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  crearDueda() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);

        this.authservice.getIdUser(payload.sub).subscribe({
          next: (res) => {
            const idUsuario = res;
            this.pagosPendientesForm.patchValue({ idUsuario });
            this.pagosPendientesService.createDeuda(this.pagosPendientesForm.value as unknown as PagosPendientesInterface ).subscribe({
              next: (response) => {
                console.log('Deuda creada exitosamente:', response);
                this.pagosPendientesForm.reset();
                alert("Deuda creada exitosamente");
                this.ngOnInit();
              },
              error: (error) => {
                console.error('Error al crear deuda:', error);
              }
            });
          }
        })
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }


  editarDeuda(p: PagosPendientesInterface) {
    this.pagosPendientesForm.reset();
    this.pagosPendientesForm.patchValue({
      id: p.id,
      nombre: p.nombre,
      monto: p.monto,
      descripcion: p.descripcion,
      tipo: p.tipo,
      meses: p.meses,
      fechaVencimiento: this.formatFecha(p.fechaVencimiento),
      estado: p.estado,
      idUsuario: p.idUsuario
    });
    const modal = new bootstrap.Modal(this.modalEditar.nativeElement);
    modal.show();
  }

  formatFecha(fecha: any): string {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
