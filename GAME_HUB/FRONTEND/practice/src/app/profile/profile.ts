import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Header, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading = true;
  activeTab = 'overview';
  isEditing = false;
  editData: any = {};
  saveMessage = '';
  saveError = '';
  isSaving = false;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.editData = { ...data };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  getUserInitial(): string {
    return this.user?.username?.charAt(0)?.toUpperCase() || '?';
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.saveMessage = '';
    this.saveError = '';
  }

  startEdit() {
    this.editData = { ...this.user, newPassword: '' };
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.saveMessage = '';
    this.saveError = '';
  }

  saveProfile() {
    this.isSaving = true;
    this.saveMessage = '';
    this.saveError = '';

    const updateData: any = {
      username: this.editData.username,
      email: this.editData.email,
      bio: this.editData.bio || ''
    };

    if (this.editData.newPassword) {
      updateData.newPassword = this.editData.newPassword;
    }

    this.profileService.updateProfile(this.user.id, updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditing = false;
        this.saveMessage = 'Profile updated successfully!';
        this.loadProfile();
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.saveError = err.error?.message || 'Failed to update profile.';
        setTimeout(() => this.saveError = '', 4000);
      }
    });
  }
}
