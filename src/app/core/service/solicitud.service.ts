import {UnsubscribeOnDestroyAdapter} from "@shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, Observable, Subject, throwError} from "rxjs";
import {ExpedienteModel} from "@core/models/expediente.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TrazabilidadModel} from "@core/models/trazabilidad.model";
import { dataBoleta } from "@core/models/dataBoleta";


export interface dataFiles {
  estadoSolicitud: string,
  mensaje: string,
  faltantes: []
  archivoBytes: string
}



@Injectable({providedIn: 'root'})
export class SolicitudService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  itemsSolicitud: BehaviorSubject<ExpedienteModel[]> = new BehaviorSubject<ExpedienteModel[]>([]);
  currentExpediente: BehaviorSubject<ExpedienteModel[]> = new BehaviorSubject<ExpedienteModel[]>([])
  private dataExpediente = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) {

    super();
  }

  setData(data: ExpedienteModel[]): void {
    this.itemsSolicitud.next(data)
  }

  get data(): ExpedienteModel[] {
    return this.itemsSolicitud.value;
  }

  get ExpedientesUsuario(): ExpedienteModel[] {
    return this.currentExpediente.value;
  }

  setSolicitudExpediente(idExpediente: string): Observable<ExpedienteModel> {
    return this.http
      .post<ExpedienteModel>(`${environment.apiUrl}/solicitudes/iniciar/${idExpediente}`,{})
  }

  getExpedientesPorUsuario(idUsuario: number) {
    this.subs.sink = this.http
      .get<ExpedienteModel[]>(`${environment.apiUrl}/expedientes/usuario/${idUsuario}`)
      .subscribe({
        next: (d) => {
          this.currentExpediente.next(d)
        }
      })
  }

  setExpedienteCompleto(idExpediente: number, data: ExpedienteModel){
    return this.http
      .put<ExpedienteModel>(`${environment.apiUrl}/expedientes/${idExpediente}`, data)
      .subscribe(() => {
        this.dataExpediente.next()
      })
  }

  setCompletarExpediente(idExpediente: number) {
    return this.http
      .get<dataFiles>(`${environment.apiUrl}/solicitudes/${idExpediente}/completar`)
  }

  getBoletaFile(idExpediente: number): Observable<dataBoleta>{
    return  this.http
      .get<dataBoleta>(`${environment.apiUrl}/boletas/descargar/${idExpediente}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
  }

  getTrazabilidad(idExpediente: number): Observable<TrazabilidadModel[]> {
    return this.http
      .get<TrazabilidadModel[]>(`${environment.apiUrl}/expedientes/${idExpediente}/trazabilidades`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )

  }
}
