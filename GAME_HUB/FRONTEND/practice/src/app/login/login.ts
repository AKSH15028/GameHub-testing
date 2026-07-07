import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
    this.errorMessage = '';
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:5238/api/auth/login', loginData)
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('userToken', response.token);
            this.router.navigate(['/game']);
          } else {
            this.errorMessage = 'Login failed. Invalid token format received.';
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else {
            this.errorMessage = 'An error occurred during sign-in. Please try again later.';
          }
        }
      });
  }
}
