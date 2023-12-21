import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { DocumentTable } from '../componentes/TablesModels/document-table.model';
import { TableServiceService } from "../componentes/Services/table-service.service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';

import {
  TableElement, TableExportUtil,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import {NgClass, DatePipe, formatDate} from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {BehaviorSubject, fromEvent, merge, Observable} from "rxjs";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {HttpClient} from "@angular/common/http";
import {AdvanceTable} from "../../advance-table/advance-table.model";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {AuthService} from "@core";

@Component({
  selector: 'app-documento',
  standalone: true,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    MatSortModule,
    MatMenuModule,
  ],
  templateUrl: './documento.component.html',
  styleUrl: './documento.component.scss'
})
export class DocumentoComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  displayedColumns = [
    'select',
    'extension',
    'fechaHoraAdicion',
    'idTipoArchivo',
    'tipoContenido',
    'usuarioAdicion',
    'idArchivo',
    'nombreTipoArchivo',
  ];
  exampleDatabase?: TableServiceService
  DocumentList!: DataSourceFetch;
  selection = new SelectionModel<DocumentTable>(true, []);
  id?: number;
  avanceTable?: DocumentTable;


  constructor(
    private tableServiceService: TableServiceService,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    super();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit(): void {
    this.loadData()
  }

  refresh() {
    return this.loadData()
  }

  addNew(){}

  editCall(row: DocumentTable) {
    console.log(row)
  }

  deleteItem(row: AdvanceTable) {
    console.log(row)
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.DocumentList.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.DocumentList.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.DocumentList.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.tableServiceService?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<DocumentTable>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.tableServiceService = new TableServiceService(this.httpClient, this.authService)
    this.DocumentList = new DataSourceFetch(
      this.tableServiceService,
      this.paginator,
      this.sort
    )

    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if(!this.DocumentList) {
          return
        }
        this.DocumentList.filter = this.filter.nativeElement.value
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

  onContextMenu(event: MouseEvent, item: AdvanceTable) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.DocumentList.filteredData.map((x) => ({
        'Extension': x.extension,
        'Tipo Contenido': x.tipoContenido,
        'Nombre Archivo': x.nombreTipoArchivo,
        'Fecha Adicion': formatDate(new Date(x.fechaHoraAdicion), 'yyyy-MM-dd', 'en') || '',
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

}

export class DataSourceFetch extends DataSource<DocumentTable> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value
  }

  set filter(filter: string){
    this.filterChange.next(filter);
  }

  filteredData: DocumentTable[] = [];
  renderedData: DocumentTable[] = [];


  constructor(
    public apiDataBase: TableServiceService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<DocumentTable[]> {
    const displayDataChanges = [
      this.apiDataBase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.apiDataBase.getFilesByUser();
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.apiDataBase.data
          .slice()
          .filter((documentTable: DocumentTable) => {
            const searchStr = (
                documentTable.extension +
                documentTable.fechaHoraAdicion +
                documentTable.idTipoArchivo +
                documentTable.tipoContenido +
                documentTable.usuarioAdicion +
                documentTable.idArchivo +
                documentTable.nombreTipoArchivo
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

  sortData(data: DocumentTable[]): DocumentTable[] {
    console.log("data " , this._sort)
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      console.log("sor " , this._sort.active)
      switch (this._sort.active) {
        case 'extension':
          [propertyA, propertyB] = [a.extension, b.extension];
          break;
        case 'fechaHoraAdicion':
          [propertyA, propertyB] = [a.fechaHoraAdicion, b.fechaHoraAdicion];
          break;
        case 'idTipoArchivo':
          [propertyA, propertyB] = [a.idTipoArchivo, b.idTipoArchivo];
          break;
        case 'tipoContenido':
          [propertyA, propertyB] = [a.tipoContenido, b.tipoContenido];
          break;
        case 'usuarioAdicion':
          [propertyA, propertyB] = [a.usuarioAdicion, b.usuarioAdicion];
          break;
        case 'idArchivo':
          [propertyA, propertyB] = [a.idArchivo, b.idArchivo];
          break;
        case 'nombreTipoArchivo':
          [propertyA, propertyB] = [a.nombreTipoArchivo, b.nombreTipoArchivo];
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

