import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  isLoading = false;
  showPassword = false;
  shake = false;

  constructor(private router: Router, private http: HttpClient) {}

  get isFormValid(): boolean {
    return this.email.trim().length > 0 && this.password.trim().length >= 6;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.isFormValid) return;
    this.errorMessage = '';
    this.isLoading = true;
    this.shake = false;

    this.http.post<any>('http://localhost:5238/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response?.token) {
          localStorage.setItem('userToken', response.token);
          this.router.navigate(['/game']);
        } else {
          this.errorMessage = 'Login failed. Invalid response.';
          this.triggerShake();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Invalid email or password.'
          : 'An error occurred. Please try again.';
        this.triggerShake();
      }
    });
  }

  private triggerShake() {
    this.shake = true;
    setTimeout(() => this.shake = false, 600);
  }
}
