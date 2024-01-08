import {Injectable} from "@angular/core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, Subject, throwError} from "rxjs";
import {IncisosModel} from "@core/models/incisos.model";
import {environment} from "../../../environments/environment";
import {AnexoModel} from "@core/models/anexo.model";

@Injectable({providedIn: 'root'})
export class IncisosService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  dataInciso: BehaviorSubject<IncisosModel[]> = new BehaviorSubject<IncisosModel[]>([])
  private dataAnexos = new Subject<void>();



  constructor(
    private http: HttpClient
  ) {
    super();
  }

  setData(data: IncisosModel[]) {
    this.dataInciso.next(data)
  }

  get data(): IncisosModel[] {
    return this.dataInciso.value;
  }

  getIncisosUpdated() {
    return this.dataAnexos.asObservable();
  }



  getIncisos() {
    this.subs.sink =  this.http
      .get<IncisosModel[]>(`${environment.apiUrl}/incisos-arancelarios`)
      .subscribe({
        next: (d) => {
          this.isTblLoading = false;
          this.dataInciso.next(d)
        }
      })
  }

  setIncisosSolicitud(idSolicitud: number, tipoAnexo: string, data: IncisosModel){
    const tipo = this.transformarAnexos(tipoAnexo, data)
    return this.http
      .post<IncisosModel>(`${environment.apiUrl}/solicitudes/${idSolicitud}/anexos/${tipoAnexo}`,tipo)
      .subscribe(() => {
        this.dataAnexos.next();
      });
  }

getIncisosExpediente(idSolicitud: number, tipoAnexo: string): Observable<IncisosModel[]>{
  return this.http
    .get<IncisosModel[]>(`${environment.apiUrl}/solicitudes/${idSolicitud}/anexos/${tipoAnexo}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )

}

  transformarAnexos(tipoAnexo: string, data: IncisosModel){
    const anexosList = new AnexoModel([],[],[]);
    switch (tipoAnexo){
      case 'TAN1':
        anexosList.anexo1 = data;
        break;
      case 'TAN2':
        anexosList.anexo2 = data;
        break;
      case 'TAN3':
        anexosList.anexo3 = data;
        break;
      case 'TAN4':
        anexosList.anexo2 = data;
        break;
    }
    return anexosList;
  }


}
