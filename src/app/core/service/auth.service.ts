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
  private   currentUserSubject: BehaviorSubject<User>;
  public    currentUser: Observable<User>;
  public    currentProfileUsers: Observable<User[]>
  private   currentUsersProfile: BehaviorSubject<User[]>;
  public    currentProfileUser: Observable<User>
  private   currentUserProfile: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentUserProfile = new  BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('perfil') || '{}') as User
    )
    this.currentProfileUser = this.currentUserProfile.asObservable();

    this.currentUsersProfile = new  BehaviorSubject<User[]>(
      JSON.parse(localStorage.getItem('usuarios') || '{}') as User[]
    )
    this.currentProfileUsers = this.currentUsersProfile.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentProfileUserValue(): User {
    return this.currentUserProfile.value;
  }

  public get currentProfileUsersValue(): User {
    const users =  this.currentUsersProfile.value;
    if (users && users.length > 0) {
      return users[0]
    }

    return {} as User;
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

  getUsuarios(flag: boolean, email: string): Observable<User[]>{
    if (flag) {
      return this.http
        .get<User[]>(`${environment.apiUrl}/usuarios`)
        .pipe(
          map((user) => {
            localStorage.setItem('usuarios', JSON.stringify(user))
            this.currentUsersProfile.next(user);
            return user;
          })
        )
    }else {
      return this.http
        .get<User[]>(`${environment.apiUrl}/usuarios?correo=${email}`)
        .pipe(
          map((user) => {
            localStorage.setItem('usuarios', JSON.stringify(user))
            this.currentUsersProfile.next(user);
            return user;
          })
        )
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear()
    this.currentUserSubject.next(this.currentUserValue);
    this.currentUserSubject.next(this.currentProfileUserValue);
    return of({ success: false });
  }
}
