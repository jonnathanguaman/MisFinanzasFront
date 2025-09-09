import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cliente, Nota, ClienteConNotas } from './anotados-interfaces';
import { environment } from '../../../Enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AnotadosService {
  private apiUrl = environment.urlhost;
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private notasSubject = new BehaviorSubject<Nota[]>([]);

  // Datos simulados para desarrollo
  private clientesData: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', descripcion: 'Cliente frecuente, compra productos de oficina' },
    { id: 2, nombre: 'María García', descripcion: 'Cliente mayorista, pedidos grandes' },
    { id: 3, nombre: 'Carlos López', descripcion: 'Cliente nuevo, interesado en tecnología' }
  ];

  private notasData: Nota[] = [
    { 
      id: 1, 
      fecha: new Date('2024-01-15'), 
      clienteId: 1, 
      producto: 'Laptop Dell', 
      cantidad: 2, 
      precio: 800, 
      total: 1600 
    },
    { 
      id: 2, 
      fecha: new Date('2024-01-16'), 
      clienteId: 1, 
      producto: 'Mouse Logitech', 
      cantidad: 5, 
      precio: 25, 
      total: 125 
    },
    { 
      id: 3, 
      fecha: new Date('2024-01-17'), 
      clienteId: 2, 
      producto: 'Monitor Samsung', 
      cantidad: 10, 
      precio: 300, 
      total: 3000 
    }
  ];

  constructor(private http: HttpClient) {
    this.clientesSubject.next(this.clientesData);
    this.notasSubject.next(this.notasData);
  }

  // Observables
  get clientes$(): Observable<Cliente[]> {
    return this.clientesSubject.asObservable();
  }

  get notas$(): Observable<Nota[]> {
    return this.notasSubject.asObservable();
  }

  // Métodos para clientes
  getClientes(): Observable<Cliente[]> {
    // return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
    return this.clientes$;
  }

  getClienteById(id: number): Cliente | undefined {
    return this.clientesData.find(cliente => cliente.id === id);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    // return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
    
    // Simulación para desarrollo
    const nuevoCliente = { 
      ...cliente, 
      id: this.clientesData.length + 1,
      fechaCreacion: new Date()
    };
    this.clientesData.push(nuevoCliente);
    this.clientesSubject.next([...this.clientesData]);
    
    return new Observable(observer => {
      observer.next(nuevoCliente);
      observer.complete();
    });
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    // return this.http.put<Cliente>(`${this.apiUrl}/clientes/${id}`, cliente);
    
    // Simulación para desarrollo
    const index = this.clientesData.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientesData[index] = { ...cliente, id };
      this.clientesSubject.next([...this.clientesData]);
    }
    
    return new Observable(observer => {
      observer.next({ ...cliente, id });
      observer.complete();
    });
  }

  deleteCliente(id: number): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
    
    // Simulación para desarrollo
    this.clientesData = this.clientesData.filter(c => c.id !== id);
    this.notasData = this.notasData.filter(n => n.clienteId !== id);
    this.clientesSubject.next([...this.clientesData]);
    this.notasSubject.next([...this.notasData]);
    
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Métodos para notas
  getNotas(): Observable<Nota[]> {
    // return this.http.get<Nota[]>(`${this.apiUrl}/notas`);
    return this.notas$;
  }

  getNotasByClienteId(clienteId: number): Nota[] {
    return this.notasData.filter(nota => nota.clienteId === clienteId);
  }

  createNota(nota: Nota): Observable<Nota> {
    // return this.http.post<Nota>(`${this.apiUrl}/notas`, nota);
    
    // Simulación para desarrollo
    const nuevaNota = { 
      ...nota, 
      id: this.notasData.length + 1,
      total: nota.cantidad * nota.precio,
      fechaCreacion: new Date()
    };
    this.notasData.push(nuevaNota);
    this.notasSubject.next([...this.notasData]);
    
    return new Observable(observer => {
      observer.next(nuevaNota);
      observer.complete();
    });
  }

  updateNota(id: number, nota: Nota): Observable<Nota> {
    // return this.http.put<Nota>(`${this.apiUrl}/notas/${id}`, nota);
    
    // Simulación para desarrollo
    const index = this.notasData.findIndex(n => n.id === id);
    if (index !== -1) {
      const notaActualizada = { 
        ...nota, 
        id,
        total: nota.cantidad * nota.precio
      };
      this.notasData[index] = notaActualizada;
      this.notasSubject.next([...this.notasData]);
    }
    
    return new Observable(observer => {
      observer.next({ ...nota, id, total: nota.cantidad * nota.precio });
      observer.complete();
    });
  }

  deleteNota(id: number): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/notas/${id}`);
    
    // Simulación para desarrollo
    this.notasData = this.notasData.filter(n => n.id !== id);
    this.notasSubject.next([...this.notasData]);
    
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Método para obtener datos combinados
  getClientesConNotas(): Observable<ClienteConNotas[]> {
    return new Observable(observer => {
      const clientesConNotas: ClienteConNotas[] = this.clientesData.map(cliente => {
        const notasCliente = this.getNotasByClienteId(cliente.id!);
        const totalVentas = notasCliente.reduce((sum, nota) => sum + nota.total, 0);
        
        return {
          cliente,
          notas: notasCliente,
          totalNotas: notasCliente.length,
          totalVentas
        };
      });
      
      observer.next(clientesConNotas);
      observer.complete();
    });
  }
}
