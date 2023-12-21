import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DocumentTable} from "../TablesModels/document-table.model";
import {environment} from "../../../../environments/environment";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {BehaviorSubject} from "rxjs";
import { AuthService } from '@core'



@Injectable({
  providedIn: 'root',
})

export class TableServiceService  extends UnsubscribeOnDestroyAdapter{

  isTblLoading = true;
  dataChange: BehaviorSubject<DocumentTable[]> = new BehaviorSubject<DocumentTable[]>([])


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    )
  {
    super();
  }

  get data(): DocumentTable[] {
    return this.dataChange.value;
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



}
