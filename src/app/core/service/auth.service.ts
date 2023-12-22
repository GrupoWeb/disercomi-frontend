import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentProfileUser: Observable<User>
  private currentUserProfile: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentUserProfile = new  BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('perfil') || '{}') as User
    )
    this.currentProfileUser = this.currentUserProfile.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentProfileUserValue(): User {
    return this.currentUserProfile.value;
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

  profileUser(){
    return this.http
      .get<User>(`${environment.apiUrl}/usuarios/autenticado`)
      .pipe(
        map((user) => {
          localStorage.setItem('perfil', JSON.stringify(user))
          this.currentUserSubject.next(user);
          return user;
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
