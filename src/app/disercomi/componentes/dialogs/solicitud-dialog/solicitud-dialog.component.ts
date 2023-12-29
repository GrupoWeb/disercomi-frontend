import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ItemsModel} from "@core/models/Items.model";
import {DatePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";

export interface DialogData {
  items: ItemsModel;
}
@Component({
  selector: 'app-solicitud-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    FormsModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './solicitud-dialog.component.html',
  styleUrl: './solicitud-dialog.component.scss'
})
export class SolicitudDialogComponent implements OnInit{

  isDetails = true;
  dialogTitle?: string;
  solicitudForm?: UntypedFormGroup;
  itemDetails: ItemsModel;


  constructor(
    public dialogRef: MatDialogRef<SolicitudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    this.dialogTitle = 'New Contacts';
    this.itemDetails = data.items
  }

  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  onNoClick(): void {
    this.dialogRef.close()
  }

  setSolicitud() {
    console.log("Datos " + this.itemDetails.valor)
  }

  ngOnInit(): void {

  }
}
