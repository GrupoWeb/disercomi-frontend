import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {ItemsModel} from "@core/models/Items.model";
import {BehaviorSubject, fromEvent, merge, Observable} from "rxjs";
import {FileService} from "@core/service/file.service";
import {map} from "rxjs/operators";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {AuthService} from "@core";
import {MatDialog} from "@angular/material/dialog";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {NgClass} from '@angular/common';
import {SolicitudDialogComponent} from "../componentes/dialogs/solicitud-dialog/solicitud-dialog.component";
import {SolicitudService} from "@core/service/solicitud.service";
import {ExpedienteModel} from "@core/models/expediente.model";
import {Direction} from "@angular/cdk/bidi";
import {Router} from "@angular/router";

@Component({
  selector: 'app-realizar-solicitudes',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FeatherIconsComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    MatMenuModule
  ],
  templateUrl: './realizar-solicitudes.component.html',
  styleUrl: './realizar-solicitudes.component.scss'
})
export class RealizarSolicitudesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns = [
    'valor',
    'descripcion',
    'costo',
    'moneda',
    'actions'
  ];
  itemDataBase?: FileService;
  ItemsList!: DataSourceFetch;
  selection = new SelectionModel<ItemsModel>(true,[])




  constructor(
    private   tableServiceService: FileService,
    public    httpClient: HttpClient,
    private   snackBar: MatSnackBar,
    private   authenticationService: AuthService,
    public    dialog: MatDialog,
    private   _expedienteService: SolicitudService,
    private router: Router
  ) {
    super();
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

  refresh() {
    return this.loadData()
  }

  detailsCall(row: ItemsModel) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(SolicitudDialogComponent, {
      data: {
        items: row
      },
      width: '50%',
      disableClose: true,
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/disercomi/solicitudes/incisos/', result])
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.tableServiceService = new FileService(this.httpClient, this.authenticationService)
    this.ItemsList = new DataSourceFetch(
      this.tableServiceService,
      this.paginator,
      this.sort,
      this.authenticationService,
      this._expedienteService
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ItemsList.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.ItemsList.renderedData.forEach((row) =>
        this.selection.select(row)
      );
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

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.ItemsList.filteredData.map((x) => ({
        'valor': x.valor,
        'Costo': x.detalle.costo,
        'Moneda': x.detalle.moneda,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }
}

export class DataSourceFetch extends DataSource<ItemsModel> {
  filterChange = new BehaviorSubject('');
  selectedRole = this.authenticationService.currentProfileUserValue;



  get filter(): string {
    return this.filterChange.value
  }

  set filter(filter: string){
    this.filterChange.next(filter);
  }

  filteredData: ItemsModel[] = [];
  renderedData: ItemsModel[] = [];
  expedienteUsuario: ExpedienteModel[] = []


  constructor(
      public    apiDataBase: FileService,
      public    paginator: MatPaginator,
      public    _sort: MatSort,
      private   authenticationService: AuthService,
      private   _ExpedienteService: SolicitudService) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));


  }

  connect(): Observable<ItemsModel[]> {
    const displayDataChanges = [
      this.apiDataBase.itemChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
      this._ExpedienteService.currentExpediente
    ];

    this.apiDataBase.getSolicitudes('C03')
    this._ExpedienteService.getExpedientesPorUsuario(this.selectedRole.idUsuario)
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.expedienteUsuario = this._ExpedienteService.ExpedientesUsuario
        this.filteredData = this.apiDataBase.items
          .slice()
          .filter((itemsModel: ItemsModel) => {
            const searchStr = (
              itemsModel.idItem +
              itemsModel.valor +
              itemsModel.descripcion +
              itemsModel.detalle.costo +
              itemsModel.detalle.rol +
              itemsModel.detalle.moneda +
              itemsModel.idCatalogo
            ).toLowerCase();

            const generalFilter = searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            const roleFilter = this.selectedRole.idRol ? itemsModel.detalle.rol === this.selectedRole.idRol : true;

            return generalFilter && roleFilter;
          });

        /**
          Inicio del filtro para verificar Fase 1 y Fase 2
         **/
        const expedienteEnProcesoTE01 = this.expedienteUsuario.some((expediente) => {
          return (expediente.idTipoExpediente === 'TE01' );
        });


        const expedienteEnProcesoTE02 = this.expedienteUsuario.some((e) => {
          return (e.idTipoExpediente === 'TE02');
        })

        if (expedienteEnProcesoTE01) {
          this.filteredData = this.filteredData.filter((itemsModel: ItemsModel) => {
            return !this.expedienteUsuario.some((expediente) => {
              return (
                (expediente.idTipoExpediente === 'TE01' ) &&
                itemsModel.idItem === expediente.idTipoExpediente
              );
            });
          });
        } else {
          this.filteredData = this.filteredData.slice();
        }

      if(expedienteEnProcesoTE02) {
          this.filteredData = this.filteredData.filter((itemsModel: ItemsModel) => {
            return !this.expedienteUsuario.some((expediente) => {
              return (
                (expediente.idTipoExpediente === 'TE02') &&
                itemsModel.idItem === expediente.idTipoExpediente
              );
            });
          });
        }else {
        this.filteredData = this.filteredData.slice();
      }

        // this.filteredData = this.filteredData.filter((itemsModel: ItemsModel) => {
        //   return !this.expedienteUsuario.some((expediente) => {
        //     return expediente.idTipoExpediente === 'TE01' && expediente.idEstado !== 'EB00' && itemsModel.idItem === expediente.idTipoExpediente;
        //   });
        // });



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

  sortData(data: ItemsModel[]): ItemsModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idItem':
          [propertyA, propertyB] = [a.idItem, b.idItem];
          break;
        case 'valor':
          [propertyA, propertyB] = [a.valor, b.valor];
          break;
        case 'descripcion':
          [propertyA, propertyB] = [a.descripcion, b.descripcion];
          break;
        case 'costo':
          [propertyA, propertyB] = [a.detalle.costo, b.detalle.costo];
          break;
        case 'rol':
          [propertyA, propertyB] = [a.detalle.rol, b.detalle.rol];
          break;
        case 'moneda':
          [propertyA, propertyB] = [a.detalle.moneda, b.detalle.moneda];
          break;
        case 'idCatalogo':
          [propertyA, propertyB] = [a.idCatalogo, b.idCatalogo];
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
