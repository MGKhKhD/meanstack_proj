import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  createUser(username: string, email: string, password: string) {
    const authData: AuthData = {
      email, password, username
    };
    this.http.post(BACKEND_URL + 'singup', authData)
    .subscribe(_ => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    }, null);
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email, password, username: null
    };
    this.http.post<{
      username: string;
      id: string;
      token: string;
      expiresIn: number
    }>(BACKEND_URL + 'login', authData)
    .subscribe(res => {
      this.token = res.token;
      if (this.token) {
        const expiresInDuration = res.expiresIn;
        this.setTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.userId = res.id;
        const now = new Date();
        this.saveAuthData(this.token, new Date(now.getTime() + expiresInDuration * 1000), this.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const info = this.getAuthData();
    if (info) {
      const {token, expirationDate, userId} = info;
      if (expirationDate && token && userId) {
        const now = new Date();
        const date = new Date(expirationDate);
        const expiresIn = date.getTime() - now.getTime();
        if (expiresIn) {
          this.token = token;
          this.isAuthenticated = true;
          this.userId = userId;
          this.setTimer(expiresIn / 1000);
          this.authStatusListener.next(true);
        }
      }
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.cleareAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || userId) {
      return;
    }
    return {
      token, expirationDate, userId
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private cleareAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}

