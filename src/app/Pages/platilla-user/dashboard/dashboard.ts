import { Component } from '@angular/core';
import { UsuarioService } from '../../../Services/usuario/usuario';
import { CategoriaServices } from '../../../Services/categoria/categoria';
import { TransaccionesService } from '../../../Services/transacciones/transacciones';
import { Usuario } from '../usuario/usuario';
import { TokenPayload } from '../../../Services/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { AuthRegister } from '../../../Services/authRegister/auth-register';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  totalUsuarios: number = 0;
  totalCategorias: number = 0;
  totalTransacciones: number = 0;
  balanceGlobal: number = 0;

  constructor(
    private authservice: AuthRegister,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaServices,
    private transaccionService: TransaccionesService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {

    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        
        this.authservice.getIdUser(payload.sub).subscribe({
          next: async res => {
            let totalBalance = 0;
            const balanceRes = await this.transaccionService.getBalanceUsuario(res).toPromise();
            totalBalance += balanceRes.data.balance;

            this.balanceGlobal = totalBalance;
          }
        });
        
        this.transaccionService.getTransaccionesDelUsuario(payload.sub).subscribe({
          next: res => this.totalTransacciones = res.data.length
        });

        this.categoriaService.getCategoriasByUsuario(payload.sub).subscribe({
          next: res => this.totalCategorias = res.data.length
        });
      }catch (error) {
        console.error('Error decoding token:', error);
        return;
      }
    }
    
  }

}
