export interface TransaccionInterface {
  id?: number;
  monto: number;
  tipo: 'INGRESO' | 'EGRESO';
  descripcion?: string;
  fechaTransaccion: Date; 
  usuarioId: number;
  categoriaId: number;

  // Datos enriquecidos si los devuelve el backend
  nombreUsuario?: string;
  nombreCategoria?: string;
}
