import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  registrationSuccess = false;

  constructor(private http: HttpClient, private router: Router) {}

  get passwordStrength(): number {
    let score = 0;
    if (this.password.length >= 6) score++;
    if (this.password.length >= 10) score++;
    if (/[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;
    return score;
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (s <= 1) return 'Weak';
    if (s <= 3) return 'Medium';
    return 'Strong';
  }

  get strengthColor(): string {
    const s = this.passwordStrength;
    if (s <= 1) return '#ff4757';
    if (s <= 3) return '#ffa502';
    return '#2ed573';
  }

  get isFormValid(): boolean {
    return this.username.trim().length >= 3 &&
           this.email.includes('@') &&
           this.password.length >= 6 &&
           this.password === this.confirmPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSignup() {
    if (!this.isFormValid) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.http.post('http://localhost:5238/api/auth/register', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.registrationSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
