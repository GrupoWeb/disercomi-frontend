import {Component, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule, MatRippleModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ExpedienteModel} from "@core/models/expediente.model";
import {IncisoTemporalModel} from "@core/models/incisoTemporal.model";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {FileService} from "@core/service/file.service";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ItemsModel} from "@core/models/Items.model";
import {NgForOf} from "@angular/common";
import {AuthService, User} from "@core";
import {Direction} from "@angular/cdk/bidi";
import {MatDialog} from "@angular/material/dialog";
import {IncisoDialogComponent} from "../componentes/dialogs/inciso-dialog/inciso-dialog.component";


@Component({
  selector: 'app-incisos-arancelarios',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    BreadcrumbComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatSortModule,
    MatTableModule,
    MatRippleModule,
    MatMenuModule,
    MatTooltipModule,
    NgForOf,
  ],
  templateUrl: './incisos-arancelarios.component.html',
  styleUrl: './incisos-arancelarios.component.scss'
})
export class IncisosArancelariosComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns = [
    'codigoInciso',
    'descripcion',
    'nombreComercial',
    'cantidad',
    'actions'
  ];
  incisoForm?: UntypedFormGroup;
  expedienteItems: ExpedienteModel;
  temporalForm?: UntypedFormGroup;
  incisoTemporal!: IncisoTemporalModel;
  itempsTemporalInciso!: IncisoTemporalModel[];
  itemCatalogo!: ItemsModel[];
  itemSat!: any;


  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public    apiDataBase: FileService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    super();
    const blackObject = {} as ExpedienteModel;
    this.expedienteItems = new ExpedienteModel(blackObject)
    this.incisoForm = this.createFormInciso()

    const blackObjectInciso = {} as IncisoTemporalModel;
    this.incisoTemporal = new IncisoTemporalModel(blackObjectInciso)
    this.temporalForm = this.createFormTemporal()
  }

  createFormInciso(): UntypedFormGroup {
    return this.fb.group({
      clasificacionEconomica: [this.expedienteItems.clasificacionEconomica, Validators.required],
      representanteLegal: [this.expedienteItems.representanteLegal, Validators.required],
      areaOcupada: [this.expedienteItems.areaAsignada, Validators.required],
      nombreEmpresa: [this.expedienteItems.nombreEmpresa, Validators.required],
      actividadEconomica: [this.expedienteItems.actividadEconomica, Validators.required],
      domicilioFiscal: [this.expedienteItems.domicilioFiscal, Validators.required],
    })
  }

  createFormTemporal(): UntypedFormGroup {
    return this.fb.group({
      codigoInciso: [this.incisoTemporal.codigoInciso, Validators.required],
      descripcion: [this.incisoTemporal.descripcion, Validators.required],
      nombreComercial: [this.incisoTemporal.nombreComercial, Validators.required],
      cantidad: [this.incisoTemporal.cantidad, Validators.required],
    })
  }

  detailsCall(_incisoTemporalModel: IncisoTemporalModel){
    console.log(_incisoTemporalModel)
  }

  getItemsClasificacion() {
    this.apiDataBase.getItems('C11')
      .subscribe({
        next: (data) => {
          this.itemCatalogo = data;
        },
      })
  }

  getRepresentantes(): User{
    return this.authService.currentProfileUsersValue;
  }

  ngOnInit(): void {
    this.getItemsClasificacion();
    this.getRepresentantes()
  }

  addNew(){
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(IncisoDialogComponent, {
      data: {
        advanceTable: this.apiDataBase,
        action: 'add',
      },
      width: '70%',
      disableClose: true,
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe(() => {
      // if (result === 1) {
      //   const updatedData = this.tableServiceService.data;
      //
      //   this.exampleDatabase?.dataChange.value.unshift(
      //     ...updatedData
      //   );
      //   this.loadData()
      //   this.refreshTable();
      //   this.showNotification(
      //     'snackbar-success',
      //     'Documento Cargado, con exito!',
      //     'bottom',
      //     'center'
      //   );
      // }
    });
  }

}
