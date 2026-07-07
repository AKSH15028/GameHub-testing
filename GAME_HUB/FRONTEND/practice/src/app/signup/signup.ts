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

  constructor(private http: HttpClient, private router: Router){}

  onSignup() {
    this.errorMessage = '';

    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const signupData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // Send the data to your .NET backend
    this.http.post('http://localhost:5238/api/auth/register', signupData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please make sure details are correct.';
          }
        }
      });
  }
}
