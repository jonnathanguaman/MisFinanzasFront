import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoriaServices } from '../../../Services/categoria/categoria';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenPayload } from '../../../Services/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { AuthRegister } from '../../../Services/authRegister/auth-register';

@Component({
  selector: 'app-categoria',
  standalone: false,
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
})

export class Categoria implements OnInit {

  @ViewChild('closeBtn', { static: false }) closeBtn!: ElementRef;



  categorias: CategoriaInterface[] = [];
  categoriaForm: FormGroup;
  categoriaSeleccionadaId?: number;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaServices,
    private authservice: AuthRegister,
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      idUsuario: [null]
    });
  }

  

  ngOnInit(): void {
    this.cargarCategorias();

  }

  get nombre() {
    return this.categoriaForm.get('nombre')!;
  }

  cargarCategorias(): void {

    const token = sessionStorage.getItem('token');
    
    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);

        this.categoriaService.getCategoriasByUsuario(payload.sub).subscribe({
          next: (res) => (this.categorias = res.data),
          error: (err) => alert('Error al cargar categorías: ' + err.message)
        });

      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  guardarCategoria(): void {

    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        
        console.log("Payload:", payload.sub);

        this.authservice.getIdUser(payload.sub).subscribe({
          next: (res) => {

            console.log("ID Usuario:", res);

            const idUsuario = res;

            this.categoriaForm.patchValue({ idUsuario });

            const categoria: CategoriaInterface = this.categoriaForm.value;

            console.log("Categoría a guardar:", categoria);

            if (this.categoriaSeleccionadaId) {
              categoria.id = this.categoriaSeleccionadaId;
              this.categoriaService.updateCategoria(categoria).subscribe({
                next: (res) => {
                  alert(res.message);
                  this.resetForm();
                  this.cargarCategorias();

                  this.closeBtn.nativeElement.click();
                },
                error: (err) => alert('Error al actualizar: ' + err.message)
              });
            } else {
              this.categoriaService.createCategoria(categoria).subscribe({
                next: (res) => {
                  alert(res.message);
                  this.resetForm();
                  this.cargarCategorias();

                  this.closeBtn.nativeElement.click();
                },
                error: (err) => alert('Error al guardar: ' + err.message)
              });
            }
          }
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        return alert("Hemos tenido un problema");
      }
    }

  }

  editarCategoria(cat: CategoriaInterface): void {
    this.categoriaSeleccionadaId = cat.id;
    this.categoriaForm.patchValue({
      nombre: cat.nombre,
      descripcion: cat.descripcion
    });
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: (res) => {
          alert(res.message);
          this.cargarCategorias();
        },
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  resetForm(): void {
    this.categoriaForm.reset();
    this.categoriaSeleccionadaId = undefined;
  }
}