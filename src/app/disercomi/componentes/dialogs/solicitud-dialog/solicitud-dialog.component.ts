import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

export interface DialogData {

}
@Component({
  selector: 'app-solicitud-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    FormsModule
  ],
  templateUrl: './solicitud-dialog.component.html',
  styleUrl: './solicitud-dialog.component.scss'
})
export class SolicitudDialogComponent {

  isDetails = true;
  dialogTitle?: string;
  solicitudForm?: UntypedFormGroup;


  constructor(
    public dialogRef: MatDialogRef<SolicitudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    this.dialogTitle = 'New Contacts';
  }

  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);
}
