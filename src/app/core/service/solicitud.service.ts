import {UnsubscribeOnDestroyAdapter} from "@shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, map, Subject} from "rxjs";
import {ExpedienteModel} from "@core/models/expediente.model";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";


export interface dataFiles{
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
}
