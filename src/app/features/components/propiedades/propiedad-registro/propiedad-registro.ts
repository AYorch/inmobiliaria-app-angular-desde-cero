import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { PropiedadService } from '../../../../_shared/propiedad-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropiedadModel } from '../../../models/propiedad-interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-propiedad-registro',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './propiedad-registro.html',
  styleUrl: './propiedad-registro.css'
})
export class PropiedadRegistro implements OnInit, OnDestroy {

  _form!: FormGroup;
  dialogData: any;
  title = 'Agregar propiedad';
  isadd = true;
  editData!: PropiedadModel;

  public data = inject(MAT_DIALOG_DATA);


  private propiedadService = inject(PropiedadService);
  private ref = inject(MatDialogRef<PropiedadRegistro>);
  private builder = inject(FormBuilder);
  private toastr = inject(ToastrService);


  ngOnInit(): void {
    this._form = this.builder.group({
      id: this.builder.control({ disabled: true, value: 0 }),
      direccion: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(50)])),
      tipo: this.builder.control('', Validators.required),
      area: this.builder.control('', Validators.compose([Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)])),
      precio: this.builder.control('', Validators.compose([Validators.required, Validators.min(20), Validators.pattern(/^\d+(\.\d{1,2})?$/)])),
      estado: this.builder.control('', Validators.required)
    });

    this._form.get('direccion')?.valueChanges.subscribe(value => {
      if (!value) return;

      //enter
      let cleaned = value.replace(/(\r\n|\r|\n|\u2028|\u2029)/g, ' ');

      //"\n"
      cleaned = cleaned.replace(/\\n/g, ' ');

      if (value !== cleaned) {
        this._form.get('direccion')?.setValue(cleaned, { emitEvent: false });
      }
    });

    this.dialogData = this.data;
    if (this.dialogData?.id) {
      this.title = 'Editar Propiedad';
      this.isadd = false;
      this.propiedadService.getPropiedadById(this.dialogData.id).subscribe(item => {
        this.editData = item;
        this._form.setValue({
          id: this.editData.id,
          direccion: this.editData.direccion,
          tipo: this.editData.tipo,
          area: this.editData.area,
          precio: this.editData.precio,
          estado: this.editData.estado
        });
      });
    }
  }


  save() {
    if (this._form.valid) {
      let _data: PropiedadModel = {
        id: this._form.value.id as number,
        direccion: this._form.value.direccion as string,
        tipo: this._form.value.tipo as string,
        area: this._form.value.area as string,
        precio: this._form.value.precio as number,
        estado: this._form.value.estado as string,
      }
      if (this.isadd) {
        this.propiedadService.createPropiedad(_data).subscribe(item => {
          this.toastr.success('Propiedad guardada correctamente', 'Éxito', { timeOut: 3000 });
          this.close();
        })
      } else {
        _data.id = this._form.getRawValue().id;
        this.propiedadService.updatePropiedad(_data).subscribe(item => {
          this.toastr.success('Propiedad actualizada correctamente', 'Éxito', { timeOut: 3000 });
          this.close();
        })
      }

    }

  }

  close() {
    this.ref.close();
  }


  preventEnter(event: any) {
    event.preventDefault();
  }

  ngOnDestroy(): void {
  }
}
