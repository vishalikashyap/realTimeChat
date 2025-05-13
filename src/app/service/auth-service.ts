import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private baseUrl = 'http://localhost:3000/auth';
  
    constructor(private http: HttpClient) {}
  
    login(data: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}/login`, data);
    }
  
    signup(data: { username: string; email: string; password: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}/signup`, data);
    }
}
