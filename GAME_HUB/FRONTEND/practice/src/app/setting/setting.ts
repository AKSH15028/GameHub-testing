import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile';
import { Header } from '../header/header';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './setting.html',
  styleUrls: ['./setting.css']
})
export class Setting implements OnInit {
  private isBrowser: boolean;

  userId = 0;
  displayName = '';
  emailAddress = '';
  bio = '';
  currentPassword = '';
  newPassword = '';
  successMessage = '';
  errorMessage = '';
  isSaving = false;
  showDeleteConfirm = false;

  // Appearance settings
  darkMode = true;
  notifications = true;
  soundEffects = true;
  volume = 70;

  activeSection = 'account';

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private http: HttpClient,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadSettings();
    this.profileService.getProfile().subscribe({
      next: (user: any) => {
        this.userId = user.id;
        this.displayName = user.username;
        this.emailAddress = user.email;
        this.bio = user.bio || '';
      },
      error: (err) => {
        console.error('Failed to load profile in settings', err);
        this.router.navigate(['/login']);
      }
    });
  }

  private loadSettings() {
    if (!this.isBrowser) return;
    const saved = localStorage.getItem('gameHubSettings');
    if (saved) {
      const s = JSON.parse(saved);
      this.darkMode = s.darkMode ?? true;
      this.notifications = s.notifications ?? true;
      this.soundEffects = s.soundEffects ?? true;
      this.volume = s.volume ?? 70;
    }
  }

  private persistSettings() {
    if (!this.isBrowser) return;
    localStorage.setItem('gameHubSettings', JSON.stringify({
      darkMode: this.darkMode,
      notifications: this.notifications,
      soundEffects: this.soundEffects,
      volume: this.volume
    }));
  }

  onSettingChange() {
    this.persistSettings();
  }

  setSection(section: string) {
    this.activeSection = section;
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSaveAccount() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.displayName || !this.emailAddress) {
      this.errorMessage = 'Display name and email are required.';
      return;
    }

    this.isSaving = true;
    const updateData: any = {
      username: this.displayName,
      email: this.emailAddress,
      bio: this.bio
    };

    if (this.newPassword) {
      updateData.newPassword = this.newPassword;
    }

    this.profileService.updateProfile(this.userId, updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        this.currentPassword = '';
        this.newPassword = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  onLogout() {
    this.http.post('http://localhost:5238/api/auth/logout', {}).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }
}
