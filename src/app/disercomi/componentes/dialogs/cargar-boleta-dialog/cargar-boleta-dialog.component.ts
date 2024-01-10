import {Component, Inject, OnInit} from '@angular/core';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SharedModule} from "@shared";
import {DocumentModel} from "@core/models/Document.model";
import {HttpErrorResponse} from "@angular/common/http";
import {FileService} from "@core/service/file.service";

export interface DialogData {
  idExpediente: number
}
@Component({
  selector: 'app-cargar-boleta-dialog',
  standalone: true,
  imports: [
    FileUploadComponent,
    MatButtonModule,
    MatDialogContent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './cargar-boleta-dialog.component.html',
  styleUrl: './cargar-boleta-dialog.component.scss'
})
export class CargarBoletaDialogComponent implements OnInit{

  dialogTitle: string;
  documentForm: UntypedFormGroup;
  advanceDocument: DocumentModel;
  idExpediente: number


  constructor(
    private fb: UntypedFormBuilder,
    public documentFile: FileService,
    public dialogRef: MatDialogRef<CargarBoletaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.dialogTitle = 'Cargar Boleta';
    const blankObject = {} as DocumentModel;
    this.advanceDocument = new DocumentModel(blankObject);
    this.documentForm = this.createDocumentForm();
    this.idExpediente = data.idExpediente
  }

  ngOnInit(): void {
  }

  createDocumentForm(): UntypedFormGroup {
    return this.fb.group({
      archivo: [this.advanceDocument.archivo, [Validators.required]],
    });
  }

  public confirmAdd(): void {
    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify({
        tipoDocumentoExpediente: 'TD01'
      })],
      {
        type: 'application/json'
      }))
    const archivo = this.documentForm.get('archivo')?.value;
    if (archivo instanceof File) {
      formData.append('adjunto', archivo)
    }

    this.documentFile.setFileBoleta(formData,this.idExpediente).subscribe({
      next: (r) => {
        this.dialogRef.close(r)
      },
      error: (e: HttpErrorResponse) => {
        this.dialogRef.close(0)
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
