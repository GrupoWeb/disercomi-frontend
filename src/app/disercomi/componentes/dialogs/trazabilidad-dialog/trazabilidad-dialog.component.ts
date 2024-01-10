import {Component, Inject} from '@angular/core';
import {TrazabilidadModel} from "@core/models/trazabilidad.model";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CommonModule, NgForOf} from "@angular/common";


export interface DialogData {
  items: TrazabilidadModel[]
}

@Component({
  selector: 'app-trazabilidad-dialog',
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
  ],
  templateUrl: './trazabilidad-dialog.component.html',
  styleUrl: './trazabilidad-dialog.component.scss'
})


export class TrazabilidadDialogComponent {

  itemsTrazabilidad: TrazabilidadModel[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {

    this.itemsTrazabilidad = data.items
  }
}
