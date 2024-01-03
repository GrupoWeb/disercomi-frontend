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
    'costo',
    'moneda',
    'actions'
  ];
  itemDataBase?: FileService;
  ItemsList!: DataSourceFetch;
  selection = new SelectionModel<ItemsModel>(true,[])




  constructor(
    private   tableServiceService: FileService,
    private   fileService: FileService,
    public    httpClient: HttpClient,
    private   snackBar: MatSnackBar,
    private   authenticationService: AuthService,
    public    dialog: MatDialog,
    private   advanceService: FileService
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
    this.dialog.open(SolicitudDialogComponent, {
      data: {
        items: row
      },
      width: '50%',
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


  constructor(
      public    apiDataBase: FileService,
      public    paginator: MatPaginator,
      public    _sort: MatSort,
      private   authenticationService: AuthService) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<ItemsModel[]> {
    const displayDataChanges = [
      this.apiDataBase.itemChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.apiDataBase.getSolicitudes('C03')
    return merge(...displayDataChanges).pipe(
      map(() => {
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
