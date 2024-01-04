import {Injectable} from "@angular/core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {DocumentTable} from "@core/models/TablesModels/document-table.model";
import {ItemsModel} from "@core/models/Items.model";
import {AuthService} from "@core";
import {HistorialModel} from "@core/models/historial.model";

@Injectable({
  providedIn: 'root',
})

export class FileService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  dataChange: BehaviorSubject<DocumentTable[]> = new BehaviorSubject<DocumentTable[]>([])
  itemChange: BehaviorSubject<ItemsModel[]> = new BehaviorSubject<ItemsModel[]>([])
  historialChange: BehaviorSubject<HistorialModel[]> = new BehaviorSubject<HistorialModel[]>([])
  dialogData!: DocumentTable;


  constructor(private http: HttpClient, private authService: AuthService,
              )
  {
    super();
  }


  setData(data: DocumentTable[]): void {
    this.dataChange.next(data);
  }

  get data(): DocumentTable[] {
    return this.dataChange.value;
  }

  get items(): ItemsModel[] {
    return this.itemChange.value
  }
  get historial(): HistorialModel[] {
    return this.historialChange.value
  }

  getDialogData() {
    return this.dialogData;
  }

  getFile(idFile: number): Observable<HttpResponse<any>>{
    return this.http
      .get(`${environment.apiUrl}/archivos/${idFile}`, {
        observe: 'response',
        responseType: 'blob' as 'json'
      })
  }

  getFilesByUser(){
    const idUser = this.authService.currentProfileUserValue
    this.subs.sink = this.http
      .get<DocumentTable[]>(`${environment.apiUrl}/archivos/usuario/${idUser.idUsuario}`)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data)
        },
        error: (e: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(e.name + ' ' + e.message)
        }
      })
  }

  downloadFile(response: HttpResponse<Blob>, filename: string): void {
    const blob = response.body;

    if (blob) {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'downloadedFile';
      link.click();
    }
  }

  setFileDocument(formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/archivos`,formData)
  }

  DeleteFile(idFile: number): Observable<any>{
    return this.http
      .delete(`${environment.apiUrl}/archivos/${idFile}`)
      .pipe(
        tap(() => {
          const updateData = this.dataChange.value.filter(item => item.idArchivo !== idFile)
          this.setData(updateData)
        })
      )
  }

  getItems(idCatalogo: string): Observable<ItemsModel[]> {
    return this.http
      .get<ItemsModel[]>(`${environment.apiUrl}/catalogos/${idCatalogo}/items`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
  }

  getHistorial(idUsuario: number) {
    return this.http
      .get<HistorialModel[]>(`${environment.apiUrl}/expedientes/usuario/${idUsuario}`)
      .subscribe({
        next: (d) => {
          this.isTblLoading = false;
          this.historialChange.next(d)
        },
        error: (e: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(e.name + ' ' + e.message)
        }
      })

  }

  getSolicitudes(idCatalogo: string) {
    this.subs.sink = this.http
      .get<ItemsModel[]>(`${environment.apiUrl}/catalogos/${idCatalogo}/items`)
      .subscribe({
        next: (d) => {
          this.isTblLoading = false;
          this.itemChange.next(d)
        },
        error: (e: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(e.name + ' ' + e.message)
        }
      })
  }


}
