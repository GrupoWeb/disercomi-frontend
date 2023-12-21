import {Injectable} from "@angular/core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {environment} from "environments/environment";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Messsages } from '@core/models/messsages'
import {User} from "@core";



@Injectable({
  providedIn: 'root'
})

export class UserService extends UnsubscribeOnDestroyAdapter {


  constructor(private http: HttpClient) {
    super();
  }

  changePassword(user: User) {
    return this.http
      .post<Messsages>(`${environment.apiUrl}/usuarios/cambiarPassword`, {
        antiguoPass: user.currentPassword,
        nuevoPass: user.newPassword
      })
      .subscribe({
        next: (data) => {
          return data;
        },
        error: (err: HttpErrorResponse) => {
          return err;
        }
      })
  }
}
