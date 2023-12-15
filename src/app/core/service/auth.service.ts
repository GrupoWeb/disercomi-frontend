import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  private getHeadersWithAuthorization(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(correo: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/usuarios/autenticar`, {
        correo,
        password,
      })
      .pipe(
        map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  profileUser(token: string){
    console.log("Profiles " , token)
    const headers = this.getHeadersWithAuthorization(token);
    return this.http
      .get<never>(`${environment.apiUrl}/usuarios/autenticado`, {headers})
      .pipe(
        map((r) => {
          return r;
        })
      )
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
