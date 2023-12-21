import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DocumentTable} from "../TablesModels/document-table.model";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";



@Injectable({
  providedIn: 'root',
})

export class TableServiceService {


  constructor(
    private http: HttpClient
    )
  {
  }

  getFilesByUser(){
    const idUser = localStorage.getItem('perfil')
    console.log("Id ", idUser)
    return this.http
      .get<DocumentTable>(`${environment.apiUrl}/archivos/usuario/1`)
      .pipe(
        map((DocumentTable)=> {
          return DocumentTable;
        })
      )
  }


}
