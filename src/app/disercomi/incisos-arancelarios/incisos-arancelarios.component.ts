import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {CommonModule, NgForOf} from "@angular/common";
import {AuthService, User} from "@core";
import {Direction} from "@angular/cdk/bidi";
import {MatDialog} from "@angular/material/dialog";
import {IncisoDialogComponent} from "../componentes/dialogs/inciso-dialog/inciso-dialog.component";
import {IncisosModel} from "@core/models/incisos.model";
import {IncisosService} from "@core/service/incisos.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SolicitudService} from "@core/service/solicitud.service";

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
    CommonModule,
  ],
  templateUrl: './incisos-arancelarios.component.html',
  styleUrl: './incisos-arancelarios.component.scss'
})
export class IncisosArancelariosComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {

  displayedColumns = [
    'idIncisoArancelario',
    'descripcionInciso',
    'nombreComercial',
    'cantidad',
    'actions'
  ];
  incisoForm: UntypedFormGroup;
  expedienteItems: ExpedienteModel;
  temporalForm?: UntypedFormGroup;
  incisoTemporal!: IncisoTemporalModel;
  itempsTemporalInciso: IncisosModel[] = [];
  itemCatalogo!: ItemsModel[];
  color: string;
  idExpedienteRouter!: number;
  incisosSubscription!: Subscription;
  filteredItems!: ItemsModel[];


  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public  apiDataBase: FileService,
    private authService: AuthService,
    public  dialog: MatDialog,
    private incisosService: IncisosService,
    private route: ActivatedRoute,
    private router: Router,
    private _solicitudService: SolicitudService
  ) {
    super();
    const blackObject = {} as ExpedienteModel;
    this.expedienteItems = new ExpedienteModel(blackObject)
    this.incisoForm = this.createFormInciso()

    const blackObjectInciso = {} as IncisoTemporalModel;
    this.incisoTemporal = new IncisoTemporalModel(blackObjectInciso)
    this.temporalForm = this.createFormTemporal()
    this.color =  '#1484C9'
    this.route.params.subscribe(params => {
      this.idExpedienteRouter = params['id'];
    });

  }

  createFormInciso(): UntypedFormGroup {
    return this.fb.group({
      clasificacionEconomica: [this.expedienteItems.clasificacionEconomica, Validators.required],
      representanteLegal: [this.expedienteItems.representanteLegal, Validators.required],
      areaAsignada: [this.expedienteItems.areaAsignada, Validators.required],
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
    this.getIncisos()
    this.incisosSubscription = this.incisosService.getIncisosUpdated().subscribe(() => {
      this.getIncisos()
    });
    this.getExpediente(this.idExpedienteRouter)

  }

  override ngOnDestroy() {
    // Desuscribirse al destruir el componente
    if (this.incisosSubscription) {
      this.incisosSubscription.unsubscribe();
    }
  }

  getIncisos(){
    this.incisosService.getIncisosExpediente(this.idExpedienteRouter,'TAN4')
      .subscribe({
        next: (d) => {
          this.itempsTemporalInciso = d
        }
      })
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

    this.subs.sink = dialogRef.afterClosed().subscribe((r) => {
      this.incisosService.setIncisosSolicitud(this.idExpedienteRouter,'TAN4', r)
    });
  }

  setExpediente() {
    this._solicitudService.setExpedienteCompleto(this.idExpedienteRouter, this.incisoForm?.getRawValue())
    this._solicitudService.setCompletarExpediente(this.idExpedienteRouter)
      .subscribe({
        next: (r) => {
          const bytesArray = this.apiDataBase.blobPdfFromBase64(r.archivoBytes)
          if (bytesArray) {
            this.apiDataBase.downloadBoletas(bytesArray, 'BOLETA_PAGO.pdf')
            this.router.navigate(['/disercomi/solicitudes/historial'])
          }
        }
      })
  }

  getExpediente(idExpediente: number){
    this._solicitudService.getExpediente(idExpediente).subscribe({
      next: (r) => {
        this.incisoForm.patchValue({
          clasificacionEconomica: r.idItem,
          representanteLegal: r.representanteLegal,
          areaAsignada: r.areaAsignada,
          nombreEmpresa: r.nombreEmpresa,
          actividadEconomica: r.actividadEconomica,
          domicilioFiscal: r.domicilioFiscal,
        })
      }
    })
  }
}
