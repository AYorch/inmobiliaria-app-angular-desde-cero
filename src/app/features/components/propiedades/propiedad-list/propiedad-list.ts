import { Component, OnInit, OnDestroy, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PropiedadService } from '../../../../_shared/propiedad-service';
import { PropiedadModel } from '../../../models/propiedad-interface';
import { Subscription } from 'rxjs';
import { PropiedadRegistro } from '../propiedad-registro/propiedad-registro';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-propiedad-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe
  ],
  templateUrl: './propiedad-list.html',
  styleUrls: ['./propiedad-list.css']
})
export class PropiedadList implements OnInit, OnDestroy, AfterViewInit {

  _list: PropiedadModel[] = [];
  subs = new Subscription();

  displayHeaders = ['id', 'direccion', 'tipo', 'precio', 'estado', 'accion'];
  datasource = new MatTableDataSource<PropiedadModel>([]);
  @ViewChild(MatTable) table!: MatTable<any>;

  private propiedadService = inject(PropiedadService);
  private matDialog = inject(MatDialog);
  private toastr = inject(ToastrService);


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  searchTerm = '';

  ngAfterViewInit(): void {
    this.getPropiedades();
  }

  getPropiedades() {
    const page = this.pageIndex + 1;
    const limit = this.pageSize;
    const search = this.searchTerm;

    const _sub = this.propiedadService.getPropiedades(page, limit, search).subscribe(response => {
      const data = response.body || [];
      this._list = data;
      this.datasource.data = data;
      this.totalItems = Number(response.headers.get('X-Total-Count')) || 0;
      this.table.renderRows();
    });

    this.subs.add(_sub);
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPropiedades();
  }

  refreshPropiedades() {
    this.getPropiedades();
  }

  add() {
    this.openPopup(0);
  }

  openPopup(id: number) {
    this.matDialog.open(PropiedadRegistro, {
      width: '60%',
      disableClose: true,
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: { id }
    }).afterClosed().subscribe(() => {
      this.refreshPropiedades();
    });
  }

  edit(id: any) {
    this.openPopup(id);
  }

  delete(id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará la propiedad con Registro N° ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.propiedadService.deletePropiedad(id).subscribe({
          next: () => {
            this.toastr.success('Propiedad eliminada correctamente', 'Éxito', {
              timeOut: 3000
            });
            this.refreshPropiedades();
          },
          error: (err) => {
            this.toastr.error('Error al eliminar la propiedad', 'Error', {
              timeOut: 3000
            });
            console.error(err);
          }
        });
      }
    });
  }

 onSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.searchTerm = value.trim().toLowerCase();
  this.pageIndex = 0;
  this.getPropiedades();
}

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
