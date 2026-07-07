import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:5238/api/profile';

  constructor(private http: HttpClient) {}

  // Get profile of specific user or currently logged-in user ('me')
  getProfile(id?: number): Observable<any> {
    if (id !== undefined) {
      return this.http.get(`${this.apiUrl}/${id}`);
    }
    return this.http.get(`${this.apiUrl}/me`);
  }

  // Update profile of specific user
  updateProfile(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, profileData);
  }
}