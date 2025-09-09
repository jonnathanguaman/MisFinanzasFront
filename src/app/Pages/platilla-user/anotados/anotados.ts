import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnotadosService } from '../../../Services/anotados/anotados.service';
import { Cliente, Nota, ClienteConNotas } from '../../../Services/anotados/anotados-interfaces';

@Component({
  selector: 'app-anotados',
  standalone: false,
  templateUrl: './anotados.html',
  styleUrl: './anotados.css'
})
export class Anotados implements OnInit {
  clientesConNotas: ClienteConNotas[] = [];
  clientes: Cliente[] = [];
  
  // Formularios
  clienteForm: FormGroup;
  notaForm: FormGroup;
  
  // Estados de modales
  showClienteModal = false;
  showNotaModal = false;
  
  // Cliente seleccionado para agregar notas
  clienteSeleccionado: Cliente | null = null;
  
  // Modo de edición
  editandoCliente: Cliente | null = null;
  editandoNota: Nota | null = null;
  
  // Estados de carga
  cargando = false;
  
  // Filtros y búsqueda
  filtroTexto = '';
  clienteFiltrado: ClienteConNotas[] = [];

  constructor(
    private fb: FormBuilder,
    private anotadosService: AnotadosService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.notaForm = this.fb.group({
      fecha: ['', Validators.required],
      clienteId: ['', Validators.required],
      producto: ['', [Validators.required, Validators.minLength(2)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    
    // Cargar clientes
    this.anotadosService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });

    // Cargar datos combinados
    this.anotadosService.getClientesConNotas().subscribe({
      next: (clientesConNotas) => {
        this.clientesConNotas = clientesConNotas;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.cargando = false;
      }
    });
  }

  // Métodos para modal de cliente
  abrirModalCliente(cliente?: Cliente) {
    console.log('Abriendo modal cliente', cliente);
    this.editandoCliente = cliente || null;
    if (cliente) {
      this.clienteForm.patchValue({
        nombre: cliente.nombre,
        descripcion: cliente.descripcion
      });
    } else {
      this.clienteForm.reset();
    }
    this.showClienteModal = true;
    console.log('showClienteModal:', this.showClienteModal);
    
    // Agregar clase al body para evitar scroll
    document.body.classList.add('modal-open');
  }

  cerrarModalCliente() {
    console.log('Cerrando modal cliente');
    this.showClienteModal = false;
    this.editandoCliente = null;
    this.clienteForm.reset();
    
    // Remover clase del body
    document.body.classList.remove('modal-open');
  }

  guardarCliente() {
    if (this.clienteForm.valid) {
      const clienteData = this.clienteForm.value;
      
      if (this.editandoCliente) {
        // Actualizar cliente existente
        this.anotadosService.updateCliente(this.editandoCliente.id!, clienteData).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModalCliente();
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
          }
        });
      } else {
        // Crear nuevo cliente
        this.anotadosService.createCliente(clienteData).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModalCliente();
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
          }
        });
      }
    }
  }

  eliminarCliente(cliente: Cliente) {
    if (confirm(`¿Estás seguro de eliminar el cliente "${cliente.nombre}"? Esto también eliminará todas sus notas.`)) {
      this.anotadosService.deleteCliente(cliente.id!).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
        }
      });
    }
  }

  // Métodos para modal de nota
  abrirModalNota(cliente?: Cliente, nota?: Nota) {
    console.log('Abriendo modal nota', cliente, nota);
    this.clienteSeleccionado = cliente || null;
    this.editandoNota = nota || null;
    
    if (nota) {
      this.notaForm.patchValue({
        fecha: this.formatearFechaParaInput(nota.fecha),
        clienteId: nota.clienteId,
        producto: nota.producto,
        cantidad: nota.cantidad,
        precio: nota.precio
      });
    } else {
      this.notaForm.reset();
      if (cliente) {
        this.notaForm.patchValue({
          clienteId: cliente.id,
          fecha: this.formatearFechaParaInput(new Date())
        });
      }
    }
    this.showNotaModal = true;
    console.log('showNotaModal:', this.showNotaModal);
    
    // Agregar clase al body para evitar scroll
    document.body.classList.add('modal-open');
  }

  cerrarModalNota() {
    console.log('Cerrando modal nota');
    this.showNotaModal = false;
    this.clienteSeleccionado = null;
    this.editandoNota = null;
    this.notaForm.reset();
    
    // Remover clase del body
    document.body.classList.remove('modal-open');
  }

  guardarNota() {
    if (this.notaForm.valid) {
      const notaData = {
        ...this.notaForm.value,
        fecha: new Date(this.notaForm.value.fecha),
        total: this.notaForm.value.cantidad * this.notaForm.value.precio
      };
      
      if (this.editandoNota) {
        // Actualizar nota existente
        this.anotadosService.updateNota(this.editandoNota.id!, notaData).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModalNota();
          },
          error: (error) => {
            console.error('Error al actualizar nota:', error);
          }
        });
      } else {
        // Crear nueva nota
        this.anotadosService.createNota(notaData).subscribe({
          next: () => {
            this.cargarDatos();
            this.cerrarModalNota();
          },
          error: (error) => {
            console.error('Error al crear nota:', error);
          }
        });
      }
    }
  }

  eliminarNota(nota: Nota) {
    if (confirm(`¿Estás seguro de eliminar esta nota del producto "${nota.producto}"?`)) {
      this.anotadosService.deleteNota(nota.id!).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar nota:', error);
        }
      });
    }
  }

  // Métodos de utilidad
  formatearFechaParaInput(fecha: Date): string {
    const d = new Date(fecha);
    return d.getFullYear() + '-' + 
           ('0' + (d.getMonth() + 1)).slice(-2) + '-' + 
           ('0' + d.getDate()).slice(-2);
  }

  calcularTotal(): number {
    const cantidad = this.notaForm.get('cantidad')?.value || 0;
    const precio = this.notaForm.get('precio')?.value || 0;
    return cantidad * precio;
  }

  aplicarFiltro() {
    if (!this.filtroTexto.trim()) {
      this.clienteFiltrado = [...this.clientesConNotas];
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.clienteFiltrado = this.clientesConNotas.filter(item =>
        item.cliente.nombre.toLowerCase().includes(filtro) ||
        item.cliente.descripcion.toLowerCase().includes(filtro) ||
        item.notas.some(nota => 
          nota.producto.toLowerCase().includes(filtro)
        )
      );
    }
  }

  onFiltroChange() {
    this.aplicarFiltro();
  }

  // Getters para validaciones de formulario
  get nombreControl() { return this.clienteForm.get('nombre'); }
  get descripcionControl() { return this.clienteForm.get('descripcion'); }
  get fechaControl() { return this.notaForm.get('fecha'); }
  get clienteIdControl() { return this.notaForm.get('clienteId'); }
  get productoControl() { return this.notaForm.get('producto'); }
  get cantidadControl() { return this.notaForm.get('cantidad'); }
  get precioControl() { return this.notaForm.get('precio'); }
}
