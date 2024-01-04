import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DATE_LOCALE, MatOptionModule} from "@angular/material/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {DocumentModel} from "@core/models/Document.model";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {ItemsModel} from "@core/models/Items.model";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { FileService } from "@core/service/file.service";
import {HistorialModel} from "@core/models/historial.model";

export interface DialogData {
  id: number;
  action: string;
  documentForm: DocumentModel;

}

@Component({
  selector: 'app-document-dialog',
  templateUrl: './documentos-dialog.component.html',
  styleUrls: ['./document-dialog.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    FileUploadComponent,
    CommonModule
  ],
})
export class DocumentosDialogComponent implements OnInit{
  dialogTitle: string;
  documentForm: UntypedFormGroup;
  advanceDocument: DocumentModel;
  itemCatalogo!: ItemsModel[];
  itemsExpediente!: HistorialModel[];


  constructor(
    public dialogRef: MatDialogRef<DocumentosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public documentFile: FileService,
    public documentService: FileService,
    private fb: UntypedFormBuilder

  ) {

    this.dialogTitle = 'Subir Documentos';
    const blankObject = {} as DocumentModel;
    this.advanceDocument = new DocumentModel(blankObject);

    this.documentForm = this.createDocumentForm();

  }

  formControl = new UntypedFormControl('', [
    Validators.required
  ])

  createDocumentForm(): UntypedFormGroup {
    return this.fb.group({
      archivo: [this.advanceDocument.archivo, [Validators.required]],
      documentoCatalogo: [this.advanceDocument.documentoCatalogo, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  public confirmAdd(): void {
    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify({
      tipoArchivo: this.documentForm.get('documentoCatalogo')?.value
    })],
      {
        type: 'application/json'
      }))
    const archivo = this.documentForm.get('archivo')?.value;
    if (archivo instanceof File) {
      formData.append('adjunto', archivo)
    }

    this.documentFile.setFileDocument(formData).subscribe({
      next: () => {
      },
      error: (e: HttpErrorResponse) => {
        console.log(e.name + ' ' + e.message);
      }
    })
  }

  getCatalogos() {
    this.documentService.getItems('C08').subscribe({
      next: (data) => {
        this.itemCatalogo = data;
      },
      error: (e: HttpErrorResponse) => {
        console.log(e.name + ' ' + e.message);
      }
    });
  }



  ngOnInit(): void {
    this.getCatalogos()
  }
}
