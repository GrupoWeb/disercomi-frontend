import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ItemsModel} from "@core/models/Items.model";
import {DatePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {SolicitudService} from "@core/service/solicitud.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

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
    private fb: UntypedFormBuilder,
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar
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
    this.solicitudService.setSolicitudExpediente(this.itemDetails.idItem)
      .subscribe({
        next: (d) => {
          this.showNotification('snackbar-success','Solicitud iniciada con éxito','top','center')
          console.log("Expediente " + d.idExpediente)
        }
      })
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  ngOnInit(): void {

  }
}
