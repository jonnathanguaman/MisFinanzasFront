export interface Cliente {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaCreacion?: Date;
}

export interface Nota {
  id?: number;
  fecha: Date;
  clienteId: number;
  cliente?: Cliente;
  producto: string;
  cantidad: number;
  precio: number;
  total: number;
  fechaCreacion?: Date;
}

export interface ClienteConNotas {
  cliente: Cliente;
  notas: Nota[];
  totalNotas: number;
  totalVentas: number;
}
