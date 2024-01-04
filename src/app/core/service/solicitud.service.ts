import {UnsubscribeOnDestroyAdapter} from "@shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ExpedienteModel} from "@core/models/expediente.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";


@Injectable({providedIn: 'root'})
export class SolicitudService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  itemsSolicitud: BehaviorSubject<ExpedienteModel[]> = new BehaviorSubject<ExpedienteModel[]>([]);


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

  setSolicitudExpediente(idExpediente: string): Observable<ExpedienteModel> {
    return this.http
      .post<ExpedienteModel>(`${environment.apiUrl}/solicitudes/iniciar/${idExpediente}`,{})
  }
}
