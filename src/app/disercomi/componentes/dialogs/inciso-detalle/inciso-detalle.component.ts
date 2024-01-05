import {Component, Inject, OnInit} from '@angular/core';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {IncisosModel} from "@core/models/incisos.model";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {IncisosService} from "@core/service/incisos.service";

export interface DialogData {
  idIncisoArancelario: string;
  descripcion: string;
  advanceTable: IncisosService
}

@Component({
  selector: 'app-inciso-detalle',
  standalone: true,
  imports: [
    FileUploadComponent,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    MatDialogClose,
    MatInputModule,
    MatIconModule,

  ],
  templateUrl: './inciso-detalle.component.html',
  styleUrl: './inciso-detalle.component.scss'
})
export class IncisoDetalleComponent implements OnInit{

  dialogTitle: string;
  detalleForm: UntypedFormGroup;
  detalleItemsForm: IncisosModel;
  itemInciso: IncisosModel = new IncisosModel({
    idIncisoArancelario: '',
    descripcion: '',
    nombre: '',
    cantidad: 0
  });


  constructor(
    public dialogRef: MatDialogRef<IncisoDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    this.dialogTitle = `Datos del Inciso Arancelario - ${data.idIncisoArancelario}  ${data.descripcion}`;
    const blankObject = {} as IncisosModel;
    this.detalleItemsForm = new IncisosModel(blankObject)

    this.detalleForm =  this.createForm();

  }

  formControl = new UntypedFormControl('', [
    Validators.required
  ])

  createForm(): UntypedFormGroup {
    return this.fb.group({
      nombre: [this.detalleItemsForm.nombre, [Validators.required]],
      cantidad: [this.detalleItemsForm.cantidad, [Validators.required]],
    })
  }

  confirmAdd() {

    this.itemInciso.nombre = this.detalleForm.value.nombre
    this.itemInciso.cantidad = this.detalleForm.value.cantidad
    this.itemInciso.idIncisoArancelario = this.data.idIncisoArancelario
    this.itemInciso.descripcion = this.data.descripcion
    this.dialogRef.close(this.itemInciso)
  }
  onNoClick() {
    this.dialogRef.close()
  }

  ngOnInit(): void {
  }
}
