import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile';

@Component({ 
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.html',
  styleUrls: ['./setting.css']
})
export class Setting implements OnInit {
  userId = 0;
  displayName = '';
  emailAddress = '';
  currentPassword = '';
  newPassword = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.displayName = user.username;
        this.emailAddress = user.email;
      },
      error: (err) => {
        console.error('Failed to load profile in settings', err);
        this.router.navigate(['/login']);
      }
    });
  }

  onSaveAccount() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.displayName || !this.emailAddress) {
      this.errorMessage = 'Display name and email are required.';
      return;
    }

    const updateData: any = {
      username: this.displayName,
      email: this.emailAddress
    };

    if (this.newPassword) {
      updateData.newPassword = this.newPassword;
    }

    this.profileService.updateProfile(this.userId, updateData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to update profile. Email may already be in use.';
        }
      }
    });
  }

  onLogout() {
    this.http.post('http://localhost:5238/api/auth/logout', {}).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed, clearing local session anyway', err);
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
