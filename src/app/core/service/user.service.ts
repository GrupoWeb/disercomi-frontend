import {Injectable} from "@angular/core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {environment} from "../../../environments/environment";
import {HttpClient} from '@angular/common/http';
import { Messsages } from '@core/models/messsages'
import {User} from "@core";
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class UserService extends UnsubscribeOnDestroyAdapter {


  constructor(private http: HttpClient) {
    super();
  }

  changePassword(user: User): Observable<Messsages> {
    return this.http
      .post<Messsages>(`${environment.apiUrl}/usuarios/cambiarPassword`, {
        antiguoPass: user.currentPassword,
        nuevoPass: user.newPassword
      })

  }
}
