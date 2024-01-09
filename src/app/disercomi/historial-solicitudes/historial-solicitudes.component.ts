import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonModule, NgClass} from "@angular/common";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {ItemsModel} from "@core/models/Items.model";
import {BehaviorSubject, fromEvent, merge, Observable} from "rxjs";
import {FileService} from "@core/service/file.service";
import {AuthService} from "@core";
import {map} from "rxjs/operators";
import {HistorialModel} from "@core/models/historial.model";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SolicitudDialogComponent} from "../componentes/dialogs/solicitud-dialog/solicitud-dialog.component";
import {SolicitudService} from "@core/service/solicitud.service";

@Component({
  selector: 'app-historial-solicitudes',
  standalone: true,
    imports: [
        BreadcrumbComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        FeatherIconsComponent,
        MatCheckboxModule,
        NgClass,
        CommonModule
    ],
  templateUrl: './historial-solicitudes.component.html',
  styleUrl: './historial-solicitudes.component.scss'
})
export class HistorialSolicitudesComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  displayedColumns = [
    'idExpediente',
    'nombreTipoExpediente',
    'fechaHoraAdicion',
    'nombreEstado',
    'actions'
  ];
  itemDataBase?: FileService;
  ItemsList!: DataSourceFetch;
  selection = new SelectionModel<HistorialModel>(true,[])
  formatoFecha!: string;
  itemsList!: ItemsModel[];

  constructor(
    private   tableServiceService: FileService,
    public    httpClient: HttpClient,
    private   snackBar: MatSnackBar,
    private   authenticationService: AuthService,
    public    dialog: MatDialog,
    private   _solicitudService: SolicitudService
  ) {
    super();
    this.formatoFecha = "dd/MM/yyyy h:mm a"
  }

  ngOnInit(): void {
      this.paginator._intl.itemsPerPageLabel="Items por página";
      this.loadData()
      this.getItems()
    }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  refresh() {
    return this.loadData()
  }

  public loadData() {
    this.tableServiceService = new FileService(this.httpClient, this.authenticationService)
    this.ItemsList = new DataSourceFetch(
      this.tableServiceService,
      this.paginator,
      this.sort,
      this.authenticationService
    )

    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if(!this.ItemsList) {
          return
        }
        this.ItemsList.filter = this.filter.nativeElement.value
      }
    )

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

  detailsCall(row: ItemsModel) {
    this.dialog.open(SolicitudDialogComponent, {
      data: {
        items: row
      },
      width: '50%',
    });
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.ItemsList.filteredData.map((x) => ({
        'Expediente': x.idExpediente,
        'Tipo Expediente': x.nombreTipoExpediente,
        'Estado': x.nombreEstado,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  getIdExpediente(historialModel: HistorialModel): string {
    const tipoExpedientePrefix = {
      'TE01': 'CZF1-',
      'TE02': 'CZF2-',
    }[historialModel.idTipoExpediente] || 'CUZF-';
    return tipoExpedientePrefix + historialModel.idExpediente;
  }

  getItems(){
    this.tableServiceService.getItems('C00').subscribe({
      next: (data) => {
        this.itemsList = data;
      }
    });
  }

  transformarEstado(_historialModel: HistorialModel): string {
    const estadoEncontrado = this.itemsList.find(estado => _historialModel.idEstado === estado.idItem);
    return estadoEncontrado ? estadoEncontrado.detalle.cssColor : "secondary";
  }

  downloadBoleta(row: HistorialModel) {
    this._solicitudService.getBoletaFile(row.idExpediente).subscribe({
      next: (r) => {
        this.tableServiceService.downloadBoletas(r.bytes)
      }
    })
  }

}

export class DataSourceFetch extends DataSource<HistorialModel> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value
  }

  set filter(filter: string){
    this.filterChange.next(filter);
  }

  filteredData: HistorialModel[] = [];
  renderedData: HistorialModel[] = [];


  constructor(
    public    apiDataBase: FileService,
    public    paginator: MatPaginator,
    public    _sort: MatSort,
    private   authenticationService: AuthService) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<HistorialModel[]> {
    const displayDataChanges = [
      this.apiDataBase.historialChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.apiDataBase.getHistorial(this.authenticationService.currentProfileUserValue.idUsuario)
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.apiDataBase.historial
          .slice()
          .filter((historialModel: HistorialModel) => {
            const searchStr = (
                historialModel.idExpediente +
                historialModel.fechaHoraAdicion +
                historialModel.idUsuario +
                historialModel.nombreUsuario +
                historialModel.nitUsuario +
                historialModel.idTipoExpediente +
                historialModel.nombreTipoExpediente +
                historialModel.idEstado +
                historialModel.nombreEstado
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

  sortData(data: HistorialModel[]): HistorialModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idExpediente':
          [propertyA, propertyB] = [a.idExpediente, b.idExpediente];
          break;
        case 'fechaHoraAdicion':
          [propertyA, propertyB] = [a.fechaHoraAdicion, b.fechaHoraAdicion];
          break;
        case 'idUsuario':
          [propertyA, propertyB] = [a.idUsuario, b.idUsuario];
          break;
        case 'nombreUsuario':
          [propertyA, propertyB] = [a.nombreUsuario, b.nombreUsuario];
          break;
        case 'nitUsuario':
          [propertyA, propertyB] = [a.nitUsuario, b.nitUsuario];
          break;
        case 'idTipoExpediente':
          [propertyA, propertyB] = [a.idTipoExpediente, b.idTipoExpediente];
          break;
        case 'nombreTipoExpediente':
          [propertyA, propertyB] = [a.nombreTipoExpediente, b.nombreTipoExpediente];
          break;
        case 'idEstado':
          [propertyA, propertyB] = [a.idEstado, b.idEstado];
          break;
        case 'nombreEstado':
          [propertyA, propertyB] = [a.nombreEstado, b.nombreEstado];
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
