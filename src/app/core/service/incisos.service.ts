import {Injectable} from "@angular/core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {IncisosModel} from "@core/models/incisos.model";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class IncisosService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  dataInciso: BehaviorSubject<IncisosModel[]> = new BehaviorSubject<IncisosModel[]>([])


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
}
