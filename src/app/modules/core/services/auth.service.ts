import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { environment } from 'src/enviroments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Token} from "../models/token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject("");
  userState$ = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  logIn(auth: any): Observable<Token> {
    return this.http.post<Token>(environment.apiHost + 'user/login', auth, {
      headers: this.headers,
    });
  }

  logOut(): Observable<string> {
    return this.http.get(environment.apiHost + 'user/logout', {
      responseType: 'text',
    });
  }

  getRole(): string {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken).role;
    }
    return "UNREGISTERED";
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') != null;

  }

  setUser(): void {
    this.user$.next(this.getRole());
  }
}
