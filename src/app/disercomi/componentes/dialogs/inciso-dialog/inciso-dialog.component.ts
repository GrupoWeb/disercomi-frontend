import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule, MatRippleModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, NgForOf} from "@angular/common";
import {IncisosService} from "@core/service/incisos.service";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {IncisosModel} from "@core/models/incisos.model";
import {BehaviorSubject, fromEvent, merge, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DialogData, DocumentosDialogComponent} from "../documentos-dialog/documentos-dialog.component";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {FileService} from "@core/service/file.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "@core";
import {MatMenuTrigger} from "@angular/material/menu";
import {Direction} from "@angular/cdk/bidi";

@Component({
  selector: 'app-inciso-dialog',
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
    FeatherIconsComponent,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    CommonModule,
    MatDialogClose,

  ],
  templateUrl: './inciso-dialog.component.html',
  styleUrl: './inciso-dialog.component.scss'
})
export class IncisoDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  dialogTitle: string;
  incisoList!: DataSourceFetch;
  selection = new SelectionModel<IncisosModel>(true, []);
  displayedColumns = [
    'select',
    'idIncisoArancelario',
    'nombre',
  ];
  exampleDatabase?: FileService


  constructor(
    public _incisosService: IncisosService,
    public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<IncisoDialogComponent>,
    public dialog: MatDialog,
  ) {
    super()
    this.dialogTitle = 'Agregar Incisos de Maquinaria y Materiales';
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Items por página";
    this.loadData()
  }

  loadData(){
    this._incisosService = new IncisosService(this.httpClient)
    this.incisoList = new DataSourceFetch(
      this._incisosService,
      this.paginator,
      this.sort
    )

    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if(!this.incisoList) {
          return
        }
        this.incisoList.filter = this.filter.nativeElement.value
      }
    )
  }

  refresh() {}

  exportExcel() {}

  addNew() {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  confirmAdd() {
    this.selection.selected.forEach((item) => {
      console.log("data "+ item.idIncisoArancelario)
    })
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.incisoList.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  onRowCheckboxChange(event: MatCheckboxChange, row: IncisosModel): void {
    // Realiza la acción que deseas cuando se selecciona una fila
    if (event.checked) {
      console.log('Fila seleccionada:', row);
      // Agrega aquí tu lógica adicional
    }

    // Realiza la lógica de selección/deselección de la fila
    this.selection.toggle(row);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.incisoList.renderedData.length;
    return numSelected === numRows;
  }

  modaRegistroInciso() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DocumentosDialogComponent, {
      data: {
        advanceTable: this._incisosService},
      width: '650px',
      disableClose: true,
      direction: tempDirection,
    });
  }

}

export class DataSourceFetch extends DataSource<IncisosModel> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value
  }

  set filter(filter: string){
    this.filterChange.next(filter);
  }

  filteredData: IncisosModel[] = [];
  renderedData: IncisosModel[] = [];


  constructor(
    public apiDataBase: IncisosService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<IncisosModel[]> {
    const displayDataChanges = [
      this.apiDataBase.dataInciso,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.apiDataBase.getIncisos();
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.apiDataBase.data
          .slice()
          .filter((incisosModel: IncisosModel) => {
            const searchStr = (
              incisosModel.idIncisoArancelario +
              incisosModel.nombre
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });

        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    )
  }

  disconnect(): void {
  }

  sortData(data: IncisosModel[]): IncisosModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idIncisoArancelario':
          [propertyA, propertyB] = [a.idIncisoArancelario, b.idIncisoArancelario];
          break;
        case 'nombre':
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : + propertyB;
      const valueB = isNaN(+propertyB) ? propertyB : + propertyA;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    })
  }
}
